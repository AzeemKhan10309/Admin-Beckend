import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { error: null }); // render views/index.ejs
});

export default router;