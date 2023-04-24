import { LightningElement ,track} from 'lwc';

export default class YtSearch2 extends LightningElement {

    @track datalist=[];
    pageToken;
    visibility=false;
    storeVid=[];

    fetchFun()
    {
        this.datalist=[];
        this.visibility=true;
        let qq=this.template.querySelector('.insert').value;
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        console.log(qq);
        fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${qq}&type=video&key=AIzaSyCBjTTdoPa85zRdCDJEwS-cjcgvZsvQGLc`, requestOptions)
        .then(response => response.json())
        .then(data=>{
            console.log(data);
            this.pageToken=data.nextPageToken;
            this.storeVid=data.items;})
        .then(()=>{
            console.log(this.storeVid);
            for(let i=0;i<this.storeVid.length;i++)
            {
                let vId=this.storeVid[i].id.videoId;
                let jObj={videoId:'',vidSrc:'',imgsrc:'',title:'',description:''};
                jObj.videoId=vId;
                jObj.vidSrc=`https://www.youtube.com/embed/${vId}`;
                jObj.imgsrc=this.storeVid[i].snippet.thumbnails.default.url;
                jObj.title=`56${this.storeVid[i].snippet.title}`;
                jObj.description=`${this.storeVid[i].snippet.description}`;
                this.datalist.push(jObj);
            }
            console.log(this.datalist);
    })
        .catch(error => console.log('error', error));
    }

    setVal(event)
    {
        console.log(event.target);
        this.template.querySelector('.video').src='https://www.youtube.com/embed/'+event.target.value;
    }

    nextpage()
    {
        this.datalist=[];
        this.visibility=true;
        let qq=this.template.querySelector('.insert').value;
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        
        fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${qq}&pageToken=${this.pageToken}&type=video&key=AIzaSyCBjTTdoPa85zRdCDJEwS-cjcgvZsvQGLc`, requestOptions)
        .then(response => response.json())
        .then(data=>{
            console.log(data);
        this.pageToken=data.nextPageToken;
    this.storeVid=data.items;})
    .then(()=>{
        for(let i=0;i<this.storeVid.length;i++)
        {
            let vId=this.storeVid[i].id.videoId;
            let jObj={videoId:'',vidSrc:'',imgsrc:'',title:'',description:''};
            jObj.videoId=vId;
            jObj.vidSrc=`https://www.youtube.com/embed/${vId}`;
            jObj.imgsrc=this.storeVid[i].snippet.thumbnails.default.url;
            jObj.title=`${this.storeVid[i].snippet.title}`;
            jObj.description=`${this.storeVid[i].snippet.description}`;
            this.datalist.push(jObj);
        }
    })
        .catch(error => console.log('error', error));
    }



}