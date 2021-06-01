import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { useState,useRef } from 'react';
import axios from 'axios';

export default function VideoUploadDiv(props)
{
    const [openUpload,setOpenUpload] = useState(false);
    const [uploadProgress,setUploadProgress] = useState(false);

    const formRef = useRef();

    function handleUploadDiv()
    {
      let state = !openUpload;
      if(state)
      {
          document.getElementById('upload-file').style.marginLeft=0;
      }
      else
      {
          document.getElementById('upload-file').style.marginLeft="-380px";
      }
      setOpenUpload(!openUpload);
    }

    function displayFileName(event)
  {
     document.getElementById('file-name').textContent= event.target.files[0].name;
  }

  async function handleUploadVideo(event)
  {
      event.preventDefault();
      if(document.getElementById('video').value==="")
      {
          return;
      }
      setUploadProgress(true);
      const formdata = new FormData(formRef.current);
      await axios({
          method:'post',
          url:'/videoFs/upload',
          data:formdata,
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress:progressEvent=>{
            const progress=(progressEvent.loaded/progressEvent.total)*100
            document.getElementById("uploadFileProgress").style.width = progress+"%";
            if(progress===100)
            {
                window.location.reload();
            }
          },
      })
  }

    return <div className="upload-file" id="upload-file">
        <form onSubmit={handleUploadVideo} ref={formRef}>
        <IconButton
        size="medium"
        onClick={()=>document.getElementById('video').click()}
        style={{color:"white"}}
        >
        <CloudUploadIcon/>
        </IconButton>
        <input type="file" name="video" id="video" hidden onChange={displayFileName}/>
        <Button
        variant="contained"
        color="default"
        type="submit"   
      >
        Upload
      </Button> 
        </form>
        <p id="file-name" style={{color:"rgb(56, 245, 71)"}}></p>
        {uploadProgress&&
        <div className="uploadProgress">   
            <div className="progressBar" id="uploadFileProgress"> 
            </div>
        </div>}
        <IconButton
        size="small"
        id="openUploadDiv"
        onClick={handleUploadDiv}
        >{openUpload?
            <ArrowLeftIcon/>
            :
            <ArrowRightIcon/>
         }
        </IconButton>
    </div>
}