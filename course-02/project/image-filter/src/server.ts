import express from 'express';
import { Application, Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app: Application = express();

  // Set the network port
  const port: string = process.env.PORT || "8082";

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req: Request, res: Response, next: NextFunction) => {
    const folderLoc: string = `${process.cwd()}/src/util/tmp`
    const imageUrl: string = req.query.image_url as string;

    if (!imageUrl) {
      res.status(401).send("Image URL is required")
    }

    try {
      const filteredImage: string = await filterImageFromURL(imageUrl) as string;
      res.status(200).sendFile(filteredImage)
    } catch (e) {
      res.status(500).send(`error filtering image: ${e}`)
    }

    if (fs.existsSync(folderLoc)) {
      fs.readdir(folderLoc, (err: Error, filesList: Array<string>) => {
        if (err) return err;
        deleteLocalFiles(folderLoc, filesList)
      })
    }

  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();