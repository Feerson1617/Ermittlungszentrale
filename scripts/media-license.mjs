// Match the exact Commons evidence, including the one verified US-government work.
// This is a bounded provenance check, not a universal legal classifier.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export async function verifyMediaLicense(image,page,root){
 const metadata=page.imageinfo[0].extmetadata;
 if(metadata.LicenseShortName?.value!==image.license)return false;
 if(/^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/.test(image.license))
  return metadata.LicenseUrl?.value===image.licenseUrl;
 if(image.license!=='Public domain'||metadata.Copyrighted?.value!=='False'||metadata.AttributionRequired?.value!=='false'||
  image.licenseUrl!=='https://commons.wikimedia.org/wiki/Template:PD-USGov-HHS'||
  image.rightsEvidence!=='docs/media/healthlicense.json')return false;
 const text=page.revisions[0].slots.main['*'];
 if(!text.includes('{{PD-USGov-HHS}}')||!text.includes('reviewlicense=United States Government Work'))return false;
 try{
  const bytes=await readFile(new URL(image.rightsEvidence,root));
  const rights=Object.values(JSON.parse(bytes).query.pages)[0];
  return createHash('sha256').update(bytes).digest('hex')===image.rightsEvidenceSha256&&
   rights.title==='Template:PD-USGov-HHS'&&rights.revisions[0].slots.main['*'].includes('official duties');
 }catch{return false;}
}
