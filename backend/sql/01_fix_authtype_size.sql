-- Fix authType column size to support Korean characters
-- '이메일', '카카오', '구글' require more than 6 bytes in UTF-8

USE amond;

ALTER TABLE user MODIFY authType VARCHAR(20) NOT NULL;
