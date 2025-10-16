// Script to fix encrypted names in production database with correct key
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Decryption function with production key
function transDecrypt(data) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from('amond123@@Aamond123@@Aamond123@@', 'utf8'); // 32 bytes for aes-256
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
    console.log('Checking for encrypted names with production key...');
    
    // Get all users with potentially encrypted names or generic names
    const [users] = await connection.query(`
      SELECT id, name, email, authType
      FROM user
      WHERE name LIKE 'U2Fs%' 
         OR name LIKE '사용자_%'
         OR name LIKE '%사용자'
         OR name IS NULL
    `);
    
    console.log(`Found ${users.length} users to process`);
    
    for (const user of users) {
      let newName = null;
      
      // Try to decrypt the name if it looks encrypted
      if (user.name && user.name.startsWith('U2Fs')) {
        const decrypted = transDecrypt(user.name);
        if (decrypted && decrypted.length > 0) {
          newName = decrypted;
          console.log(`Successfully decrypted name for user ${user.id}: ${newName}`);
        }
      }
      
      // Try to get name from email
      if (!newName || newName.startsWith('사용자_')) {
        if (user.email) {
          try {
            const decryptedEmail = transDecrypt(user.email);
            if (decryptedEmail && decryptedEmail.includes('@')) {
              newName = decryptedEmail.split('@')[0];
              console.log(`Got name from email for user ${user.id}: ${newName}`);
            }
          } catch (e) {
            console.error('Failed to decrypt email for user', user.id);
          }
        }
      }
      
      // Update the user's name if we have a better one
      if (newName && newName !== user.name && !newName.startsWith('사용자_')) {
        await connection.query('UPDATE user SET name = ? WHERE id = ?', [newName, user.id]);
        console.log(`Updated user ${user.id}: ${user.name} -> ${newName}`);
      }
    }
    
    console.log('\nName fixing completed!');
    
    // Show results
    const [results] = await connection.query(`
      SELECT id, authType, grade, name
      FROM user
      ORDER BY id
      LIMIT 30
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