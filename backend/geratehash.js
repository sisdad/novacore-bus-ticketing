const bcrypt = require('bcrypt');

async function generate() {
    const password = 'admin123';
    const hash = await bcrypt.hash('sis@1234', 10);
    console.log(hash);
}

generate();