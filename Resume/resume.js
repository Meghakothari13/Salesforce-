import { LightningElement ,track} from 'lwc';
import pdflib from "@salesforce/resourceUrl/pdflib";
import { loadScript } from 'lightning/platformResourceLoader';
export default class Resume extends LightningElement {

    step='Personal Information';
    //stepName=this.template.querySelector(`.${this.step}`);;
    imgSrc='';
    imgType;
    name;
    showTable=false;
    firstPage=true;
    secPage=false;
    thirdPage=false;
    isShowEducationModal=false;
    isShowHobbiesModal=false;
    isShowPIModal=false;
    isShowPreviewModal=false;
    @track resumeInfo=[];
    @track educationArr=[];
    @track addInfoArr=[];
    @track personalInfoArr=['Name','Contact','Email'];
    @track piValues=[];
    @track edVal;
    @track hobbieVal=[];
    renderedCallback() {
        console.log('rendered callback');
        loadScript(this, pdflib).then(() => {});
    }

  get acceptedFormats() {
        return ['.pdf', '.png','.jpg'];
    }
  async createPdf() {
    console.log('OUTPUT : pdf button');
    const pdfDoc = await PDFLib.PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(
      PDFLib.StandardFonts.TimesRoman
    );
    console.log('OUTPUT : abcd');
    const page = pdfDoc.addPage();
    const { width,height } = page.getSize();
    console.log('OUTPUT : ',width,height);
    const jpgImageBytes = await fetch(this.imgSrc).then((res) => res.arrayBuffer());
    var jpgImage;
    if(this.imgType=="image/png")
    {
        jpgImage = await pdfDoc.embedPng(jpgImageBytes);
    }
    else if(this.imgType=="image/jpeg")
    {
        jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
    }
    
  const jpgDims = jpgImage.scale(0.25);
    const fontSize = 20;
    page.drawText("Resume", {
      x: 250,
      y: height - 2 * fontSize,
      size: 40,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0.53, 0.71)
    });
    page.drawText("Personal Information", {
      x: 50,
      y: height - 5 * fontSize,
      size: 30,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0, 0)
    });
    page.drawLine({
    start: { x: 50, y: height - 5.5 * fontSize },
    end: { x: 310, y: height - 5.5 * fontSize },
    thickness: 2,
    color: PDFLib.rgb(0, 0, 0),
    opacity: 0.75
    });
    let piKeys=Object.keys(this.resumeInfo[0].Personal_Information);
    
    console.log('OUTPUT :pi array ',JSON.stringify(Object.keys(this.resumeInfo[0].Personal_Information)));
    let p=6;
    for(let i=0;i<piKeys.length;i++)
    {
      p++;
      console.log('OUTPUT : for entered');
      console.log('OUTPUT : ',JSON.stringify(this.resumeInfo[0].Personal_Information));
      if(piKeys[i]=='Image')
      {
         continue;
      }
      else
      {
       let txt=piKeys[i]+' : '+this.resumeInfo[0].Personal_Information[piKeys[i]];
        console.log('OUTPUT : txt==',txt);        
        page.drawText(txt, {
        x: 50,
        y: height - (++p) * fontSize,
        size: 20,
        font: timesRomanFont,
        color: PDFLib.rgb(0, 0, 0)
        });
      }
    }

    page.drawImage(jpgImage, {
    x: page.getWidth()/1.1- jpgDims.width/2.1 - 50 ,
    y: page.getHeight()/1.22 - jpgDims.height/3 + 10,
    width: jpgDims.width/1,
    height: jpgDims.height/1,
    });


  page.drawText("Education", {
      x: 50,
      y: height - 15 * fontSize,
      size: 30,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0, 0)
    });
  page.drawLine({
    start: { x: 50, y: height - 15.5 * fontSize },
    end: { x: 180, y: height - 15.5 * fontSize },
    thickness: 2,
    color: PDFLib.rgb(0, 0, 0),
    opacity: 0.75
    });

    let m=16;
    
    for(let i=0;i<this.resumeInfo[1].Education.length;i++)
    {
      let var1 = this.resumeInfo[1].Education[i];
      console.log('OUTPUT : ed for inside var ', JSON.stringify(var1));
      let edKeys=Object.keys(this.resumeInfo[1].Education[i]);
      console.log('OUTPUT : ',JSON.stringify(edKeys));
      //m++;
      console.log('OUTPUT : for entered');
      console.log('OUTPUT : ',JSON.stringify(this.resumeInfo[1].Education));
      console.log('OUTPUT : ',edKeys.length);
      for(let j=0;j<edKeys.length;j++)
      {
        ++m;
        console.log('OUTPUT : ekKeysFor entered');
        if(edKeys[j]=='Degree')
        {
          let txt=edKeys[j] +' : '+var1[edKeys[j]];
          console.log('OUTPUT : txt= edu=',txt);        
          page.drawText(txt, {
            x: 50,
            y: height - (++m) * fontSize,
            size: 20,
            font: timesRomanFont,
            color: PDFLib.rgb(0, 0, 0)
            });
        }
        else
        {
          let txt=edKeys[j] +' : '+var1[edKeys[j]];
          console.log('OUTPUT : txt= edu=',txt);        
          page.drawText(txt, {
            x: 50,
            y: height - (++m) * fontSize,
            size: 15,
            font: timesRomanFont,
            color: PDFLib.rgb(0, 0, 0)
            });
        }   
      }
         
    }

    page.drawText("Additional Information", {
      x: 300,
      y: height - 15 * fontSize,
      size: 30,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0, 0)
    });

    page.drawLine({
    start: { x: 300, y: height - 15.5 * fontSize },
    end: { x: 580, y: height - 15.5 * fontSize },
    thickness: 2,
    color: PDFLib.rgb(0, 0, 0),
    opacity: 0.75
    });

    let q=16;
    let aiKeys=Object.keys(this.resumeInfo[2].Additional_Information);
    console.log('OUTPUT : AI ' ,aiKeys);
    console.log('OUTPUT : Ai loength', aiKeys.length);
    for(let i=0;i<aiKeys.length;i++)
    {
      ++q;
      console.log('OUTPUT : for entered');
      console.log('OUTPUT : ',JSON.stringify(this.resumeInfo[2].Additional_Information));
      let head=aiKeys[i] + ' : ';
      console.log('OUTPUT : heading',head);
      let txt=this.resumeInfo[2].Additional_Information[aiKeys[i]];
      console.log('OUTPUT : txt==',txt);        
      page.drawText(head, {
        x: 300,
        y: height - (++q) * fontSize,
        size: 20,
        font: timesRomanFont,
        color: PDFLib.rgb(0, 0, 0)
        });
        
      page.drawText(txt, {
      x: 300,
      y: height - (++q) * fontSize,
      size: 15,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0, 0)
      });
          
    }

  
    const pdfBytes = await pdfDoc.save();
    var n=this.name+" Resume";
    console.log('OUTPUT : ',n);
    this.saveByteArray(n, pdfBytes);
  }
  saveByteArray(pdfName, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = pdfName;
    link.download = fileName;
    link.click();
  }

  stepInc(event)
  {
      this.step=event.target.value;
      console.log('OUTPUT : ',this.step );
      if(this.step=='Personal Information')
      {
          this.firstPage=true;
          this.secPage=false;
          this.thirdPage=false;
      }
      else if(this.step=='Education')
      {
          this.firstPage=false;
          this.secPage=true;
          this.thirdPage=false;
      }
      else if(this.step=='Additional Information')
      {
           this.firstPage=false;
          this.secPage=false;
          this.thirdPage=true;
      }

  }



  loadImg(event)
  {
      let i=event.target.files[0];
      this.imgSrc=URL.createObjectURL(event.target.files[0]);
      const img=new Image();
      img.src=URL.createObjectURL(event.target.files[0]);
      console.log('OUTPUT : ',this.imgSrc);
      this.imgType=i.type;
      img.onload=function()
      {
        console.log('Image width & height ',this.width,this.height);
        if(this.width>640 && this.height>640)
        {
         this.imgSrc='';
          this.imgType='';
          alert('Image size should be less than 640*640');;
        }
      }

  }


  nextPath()
  {
      var g;
      if(this.step=='Personal Information')
      {
        this.name=this.template.querySelector('.Name').value;
    console.log('OUTPUT : name',this.name);
        console.log('OUTPUT : personal if');
        var val='Personal_Information';
        var jsonPersonal={};
        for(let i=0;i<this.personalInfoArr.length;i++)
        {
            var field=this.personalInfoArr[i];
            console.log('OUTPUT field: ',field);
            var clName='.'+field;
            console.log('OUTPUT classs: ',clName);
            var entry=this.template.querySelector(clName).value;
            console.log('OUTPUT value: ',entry);
            if(entry=="")
            {
              continue;
            }
            else
            {
              jsonPersonal[field]=entry;
              let p=field+' :  '+entry;
              this.piValues.push(p);
            }
            
        }
        if(this.imgSrc!='')
        {
          jsonPersonal['Image']=this.imgSrc;
        }
       
        console.log('OUTPUT : ppp',JSON.stringify(this.piValues));
        console.log('OUTPUT : ',val);
        g={[val] :jsonPersonal}; 
        console.log('OUTPUT : ',Object.keys(jsonPersonal).length);
        if(Object.keys(jsonPersonal).length!=0)
        {
          this.resumeInfo.push(g);
        }
        console.log('OUTPUT : next');
        console.log('OUTPUT : ',typeof this.step);
        this.step='Education';
        this.firstPage=false;
        this.secPage=true;
      }
      else if(this.step=='Education')
      {
        console.log('OUTPUT : edu if ');
         var val=this.step;
         var jarr=[];
         
         for(let i=0;i<this.educationArr.length;i++)
        {
          
          var degree=this.template.querySelectorAll('.degree')[i].value;
          var school=this.template.querySelectorAll('.school')[i].value;
          var cgpa=this.template.querySelectorAll('.cgpa')[i].value;
          var jsonPersonal={
            'Degree':degree,
            'School':school,
            'Percentage':cgpa
          };
          console.log('OUTPUT value: ',degree);
          console.log('OUTPUT sch: ',school);
          console.log('OUTPUT cgpa: ',cgpa);
          jarr.push(jsonPersonal);
        }
         console.log('OUTPUT pi json: ',JSON.stringify(jarr));
         this.edVal=jarr;
        g={[val] :jarr};
        if(jarr.length!=0)
        {
          this.resumeInfo.push(g);
        }
        
        this.step='Additional Information';
        this.secPage=false;
        this.thirdPage=true;
      }
      else if(this.step=='Additional Information')
      {
        console.log('OUTPUT : add info ');
        var val='Additional_Information';
        var jsonPersonal={};
        for(let i=0;i<this.addInfoArr.length;i++)
        {
          
            var field=this.addInfoArr[i];
            console.log('OUTPUT field: ',field);
            var clName='.'+field;
            console.log('OUTPUT classs: ',clName);
            var entry=this.template.querySelectorAll('.adInfo')[i].value;
            console.log('OUTPUT value: ',entry);
            if(entry=="")
            {
              continue
            }
            else{
              jsonPersonal[field]=entry;
              let p=entry +'('+field+')';
              this.hobbieVal.push(p);
            }
            
        }
        console.log('OUTPUT pi json: ',JSON.stringify(jsonPersonal));
        console.log('OUTPUT : ',val);
        g={[val] :jsonPersonal}; 
        console.log('OUTPUT : ');
        console.log(Object.keys(jsonPersonal).length);
        if(Object.keys(jsonPersonal).length!=0)
        {
          this.resumeInfo.push(g);
        }
        
        console.log('OUTPUT : next');
        console.log('OUTPUT : ',typeof this.step);
        this.thirdPage=false;
        //console.log(JSON.stringify(this.resumeInfo[0].Personal_Information.Name));
        this.isShowPreviewModal=true;
        
      }

      console.log('OUTPUT : ',JSON.stringify(this.resumeInfo));
  }
  hidePiModalBox()
  {
      this.isShowPIModal=false;
  }

  addFields()
  {
      this.isShowPIModal=true;
  }

  savePiModalRecord()
  {
        var fieldName=this.template.querySelector('.fieldName').value;
        this.personalInfoArr.push(fieldName);
        console.log('OUTPUT : ',JSON.stringify(this.personalInfoArr));
        this.isShowPIModal = false;
  }
  addEducation()
  {
      this.isShowEducationModal=true;
  }

  hideModalBox() 
    {  
        this.isShowEducationModal = false;
    }

   saveModalRecord()
    {
        var degree=this.template.querySelector('.degree1').value;
        this.educationArr.push(degree);
        console.log('OUTPUT : ',JSON.stringify(this.educationArr));
        this.isShowEducationModal = false;   
    }

    addHobbies()
    {
      this.isShowHobbiesModal=true;
    }

    hideHobbiesModalBox()
    {
      this.isShowHobbiesModal=false;
    }

    saveHobbiesModalRecord()
    {
      var addInfo=this.template.querySelector('.addInfo').value;
      this.addInfoArr.push(addInfo);
      console.log('OUTPUT : ',JSON.stringify(this.addInfoArr));
      this.isShowHobbiesModal=false;
    }


    hideAddInfoModalBox()
    {
      this.isShowHobbiesModal=false;
    }

    hidePreviewModalBox()
    {
      this.isShowPreviewModal=false;
      this.thirdPage=true;
    }

}