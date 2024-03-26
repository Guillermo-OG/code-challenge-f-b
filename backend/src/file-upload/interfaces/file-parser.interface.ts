export interface FileParser {
  parseFile(file: Express.Multer.File): Promise<any[]>;
}
