export const loadAllAssets = async (req, res) => {
  const assets = [
    {
      type: 'image',
      src: 'https://i.stack.imgur.com/Bhpd8.jpg',
      height: 350,
      width: 250,
    },
    {
      src: 'https://img.freepik.com/free-photo/fresh-yellow-daisy-single-flower-close-up-beauty-generated-by-ai_188544-15543.jpg',
      height: 350,
      width: 250,
    },
    {
      src: 'https://render.fineartamerica.com/images/rendered/default/poster/8/3.5/break/images/artworkimages/medium/2/french-riviera-nice-harbour-john-and-tina-reid.jpg',
      height: 350,
      width: 250,
    },
  ];
  res.json(assets);
};
