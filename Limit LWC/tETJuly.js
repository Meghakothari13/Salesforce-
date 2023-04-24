import { LightningElement,api,track } from 'lwc';
import myFun1 from '@salesforce/apex/usericenses.myFun1';
import myFun2 from '@salesforce/apex/usericenses.myFun2';
import fieldDetails from '@salesforce/apex/usericenses.fieldDetails';
export default class TETJuly extends LightningElement
{
    show=false;
    formula=false;
    rollup=false;
    masterDetail=false;
    lookup=false;
    @track userLicenseList=[];
    @track finaluserLicenseList=[];
    @track objectList=[];
    fieldName=['All Fields','Formula Fields','Rollup','Master-Detail','Lookup'];
    fieldSize=[900,16,40,2,40];
    @track fieldList=[];
    @track finalFieldList=[];
    connectedCallback() {
        this.calculateUserLicense();
        this.objecListFun();
    }

    calculateUserLicense()
    {
          myFun1().then(result=>
        {
            this.userLicenseList=result;
            
        for(let i=0;i<this.userLicenseList.length;i++)
        {
            
            let total=this.userLicenseList[i].TotalLicenses;
            let used=this.userLicenseList[i].UsedLicenses;
           
            let available=total-used;
           
            let j={
                'Id':this.userLicenseList[i].Id,
                'Name':this.userLicenseList[i].Name,
                'UsedLicenses':this.userLicenseList[i].UsedLicenses,
                'TotalLicenses':this.userLicenseList[i].TotalLicenses,
                'AvailableLicenses':available
            };

            this.finaluserLicenseList.push(j);
        }
           
        }).catch(error=>{
            console.log(error);
        });

    }


    objecListFun()
    {
        myFun2().then(result=>{
            this.objectList=result;
            console.log('OUTPUT objects : ',JSON.stringify(this.objectList));
        }).catch(error=>{
            console.log('OUTPUT error: ',error);
        })
    }



    selObjectFun()
    {
        this.finalFieldList=[];
        this.show=true;
        let selectedObj=this.template.querySelector('[data-id="object"]').value;
        console.log('OUTPUT : ',selectedObj);
        console.log('OUTPUT : ',this.formula,this.rollup,this.lookup,this.masterDetail);
        fieldDetails({objApiName:selectedObj}).then(result=>
        {
            this.fieldList=result;
            console.log('OUTPUT : ',JSON.stringify(result));
            for(let i=0;i<this.fieldList.length;i++)
            {
                let total=this.fieldSize[i];
                
                let used=this.fieldList[i];
                
                let available=total-used;
                
                
                if((this.fieldName[i]=='Formula Fields' && this.formula==false)||(this.fieldName[i]=='Rollup' && this.rollup==false)||
                (this.fieldName[i]=='Master-Detail' && this.masterDetail==false)||(this.fieldName[i]=='Lookup' && this.lookup==false))
                {
                    continue;
                }
                else 
                {
                    let j={
                        'Name':this.fieldName[i],
                        'Total':total,
                        'Used':used,
                        'Available':available
                    };
                    this.finalFieldList.push(j);
                }
          
            }

            console.log('OUTPUT : ',JSON.stringify(this.finalFieldList));
        }).catch(error=>{
            console.log('OUTPUT : ',error);
        })
    }

    checkedFun(event)
    {
        console.log('OUTPUT : ',event.target.value);
        let v=event.target.value;
        console.log('OUTPUT : ',v);
        if(v=='Formula Fields' && this.formula==false)
        {
            this.formula=true;
        }
        else if(v=='Formula Fields' && this.formula==true)
        {
            this.formula=false;
        }
        else if(v=='Rollup' && this.rollup==false)
        {
            this.rollup=true;
        }
        else if(v=='Rollup' && this.rollup==true)
        {
            this.rollup=false;
        }
        else if(v=='Master-Detail' && this.masterDetail==false)
        {
            this.masterDetail=true;
        }
        else if(v=='Master-Detail' && this.masterDetail==true)
        {
            this.masterDetail=false;
        }
        else if(v=='Lookup' && this.lookup==false)
        {
            this.lookup=true;
        }
        else if(v=='Lookup' && this.lookup==true)
        {
            this.lookup=false;
        }


        this.selObjectFun();
    }
}