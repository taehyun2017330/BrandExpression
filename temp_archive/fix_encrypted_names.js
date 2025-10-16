// Script to fix encrypted names in production database
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Decryption function (matching the backend)
function transDecrypt(data) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from('ThisIsAsampleBitKey123', 'utf8');
  const iv = Buffer.alloc(16, 0);
  
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed for:', data);
    return null;
  }
}

async function fixEncryptedNames() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'QkdwkWkd12@@',
    database: 'amond'
  });

  try {
    console.log('Checking for encrypted names...');
    
    // Get all users with potentially encrypted names
    const [users] = await connection.query(`
      SELECT id, name, email, authType
      FROM user
      WHERE name LIKE 'U2Fs%' OR name IS NULL
    `);
    
    console.log(`Found ${users.length} users with encrypted or null names`);
    
    for (const user of users) {
      let newName = null;
      
      // Try to decrypt the name if it looks encrypted
      if (user.name && user.name.startsWith('U2Fs')) {
        const decrypted = transDecrypt(user.name);
        if (decrypted) {
          newName = decrypted;
        }
      }
      
      // If decryption failed or name was null, generate from email or authType
      if (!newName) {
        if (user.email) {
          try {
            const decryptedEmail = transDecrypt(user.email);
            if (decryptedEmail && decryptedEmail.includes('@')) {
              newName = decryptedEmail.split('@')[0];
            }
          } catch (e) {
            console.error('Failed to decrypt email for user', user.id);
          }
        }
        
        // Fallback to authType-based name
        if (!newName) {
          if (user.authType === '카카오') {
            newName = '카카오 사용자';
          } else if (user.authType === '구글') {
            newName = '구글 사용자';
          } else {
            newName = `사용자_${user.id}`;
          }
        }
      }
      
      // Update the user's name
      if (newName && newName !== user.name) {
        await connection.query('UPDATE user SET name = ? WHERE id = ?', [newName, user.id]);
        console.log(`Updated user ${user.id}: ${user.name} -> ${newName}`);
      }
    }
    
    console.log('Name fixing completed!');
    
    // Show results
    const [results] = await connection.query(`
      SELECT id, authType, grade, name
      FROM user
      ORDER BY id
      LIMIT 20
    `);
    
    console.log('\nSample users after fix:');
    console.table(results);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

// Run the fix
fixEncryptedNames().catch(console.error);