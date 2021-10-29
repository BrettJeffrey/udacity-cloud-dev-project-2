import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {

    const image_url: string  = req.query.image_url;

    let testImageUrlResult: boolean;

    try {
      new URL(req.query.image_url);
      testImageUrlResult = true;
    } catch (e) {
      testImageUrlResult = false;
    }

    if (!image_url) {
      return res.status(422).send('param image_url was not defined.');
    }
    
    if (!testImageUrlResult) {
      return res.status(422).send('image_url was provided, but is not a valid URL.');
    }
    
    const imagePath = await filterImageFromURL(image_url);

    return res.status(200).sendFile(imagePath, () => {
      deleteLocalFiles([imagePath]);
    })
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();