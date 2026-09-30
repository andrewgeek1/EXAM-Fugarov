//  Настройки проекта


module.exports = {
  port: 3000,                    
  secret: 'conferences-secret',  


  db: {
    host: '127.0.0.1',          
    port: 3306,
    user: 'root',             
    password: '',               
    database: 'conferences',    
    dateStrings: true          
  }
};
