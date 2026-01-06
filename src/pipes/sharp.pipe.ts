import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class SharpPipe implements PipeTransform {
  async transform(files: any) {
    if (!files) return {};

    const toursUploadPath = path.join(process.cwd(), 'uploads/tours');
    if (!fs.existsSync(toursUploadPath))
      fs.mkdirSync(toursUploadPath, { recursive: true });

    const usersUploadPath = path.join(process.cwd(), 'uploads/users');
    if (!fs.existsSync(usersUploadPath))
      fs.mkdirSync(usersUploadPath, { recursive: true });

    const results: any = {};

    if (files.imageCover) {
      const name = `tour-imageCover-${uuidv4()}.jpeg`;
      await sharp(files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(toursUploadPath, name));
      results.imageCover = name;
    }

    if (files.images) {
      results.images = await Promise.all(
        files.images.map(async (img: any, i: any) => {
          const name = `tour-${uuidv4()}-${i + 1}.jpeg`;
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(toursUploadPath, name));
          return name;
        }),
      );
    }

    if (files.photo) {
      const name = `user-${uuidv4()}.jpeg`;
      await sharp(files.photo[0].buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(usersUploadPath, name));
      results.photo = name;
    }
    return results;
  }
}
