import { v4 as uuidv4 } from 'uuid';
import path = require('path')

const STARTED_FROM = "../.."

export async function uuid_gen(){
  const uuid = uuidv4();
  return uuid
}

export class Root_of {
  private no_trick(filename: string){return !/[\.]{2,}|[\/\\]/.test(filename)}
  
  file(filename: string){
    if (this.no_trick(filename)){
      console.log (path.join(__dirname, "../"))
      return "../"
      // return path.join(__dirname, `${STARTED_FROM}/../${filename}`)
    }
  }
}