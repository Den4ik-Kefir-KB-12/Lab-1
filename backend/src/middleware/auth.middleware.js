const demoAuth = (req, res, next) => {
    const userId = req.header("X-Demo-UserId");
    
    if (!userId) {
        return res.status(401).json({ 
            status: 401, 
            message: "Unauthorized: Відсутній заголовок X-Demo-UserId" 
        });
    }

    req.user = { id: Number(userId) };
    next();
};

module.exports = { demoAuth };