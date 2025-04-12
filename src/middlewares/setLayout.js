module.exports = (req, res, next) => {
    const user = res.locals.user;
    console.log('🧪 [setLayout] user:', user); // 👉 in ra để test
  
    if (user?.role === 'admin') {
      res.locals.layout = 'layouts/admin-layout';
    } else {
      res.locals.layout = 'layouts/client-layout';
    }
  
    next();
  };
  