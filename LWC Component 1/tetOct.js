import { LightningElement,track,api} from 'lwc';
import myFun1 from '@salesforce/apex/TetOct.myFun1';
import myFun2 from '@salesforce/apex/TetOct.myFun2';
export default class TetOct extends LightningElement {

    objectName='';
    noOfRecords;
    @track fieldSets=[];
    isEnter=false;
    @track d=[];
    @track data=[];
    @track sendData=[];
    
    get options() {
        return [
            { label: 'Account', value: 'Account' },
            { label: 'Opportunity', value: 'Opportunity' },
            { label: 'Contact', value: 'Contact' },
        ];
    }

    handleChange(event) {
        this.isEnter=false;
        this.fieldSets=[];
        this.d=[];
        this.data=[];
        this.objectName = event.detail.value;
        console.log('OUTPUT : ',this.objectName);
         myFun1({'objName':this.objectName}).then(result=>
        {            
            console.log('OUTPUT : ',JSON.stringify(result));           
            this.fieldSets=Object.keys(result);
            console.log('OUTPUT : len',this.fieldSets.length);           
            for(let i=0;i<this.fieldSets.length;i++)
            { 
                console.log('OUTPUT : loop',result[this.fieldSets[i]]);
                console.log('OUTPUT : set',this.fieldSets[i]);
                let js={
                    'id':i,
                    'Name': '',
                    'DataType' :'',
                    'Option' : [],
                    'Type':'text'
                };              
                 this.data.push(js);
                  this.d.push({'Name':this.fieldSets[i],'DataType':result[this.fieldSets[i]]})
            }
        }).catch(error=>
        {
            console.log('OUTPUT : error',JSON.stringify(error));
        });
    }

    handleClick()
    {
        this.isEnter=true;
        console.log('OUTPUT : Button clicked');
        console.log('OUTPUT : object',this.objectName);
        this.noOfRecords=parseInt(this.template.querySelector('[data-id="numberRecords"]').value);
        console.log('OUTPUT : type of number ',this.noOfRecords);        
        console.log('OUTPUT : final data',JSON.stringify(this.data));
        console.log('OUTPUT : final d',JSON.stringify(this.d));  
    }

    choseFieldFun()
    {
        let j=event.target.parentElement.dataset.id;
        for(let i=0;i<this.fieldSets.length;i++)
        {
            if(this.d[i].Name==event.target.value)
            {
                if(this.d[i].DataType=='CURRENCY' || this.d[i].DataType=='INTEGER')
                {
                    this.data[j].Name=event.target.value;
                    this.data[j].Option=['Random','Fix'];
                    this.data[j].Type='number';
                    this.data[j].DataType=this.d[i].DataType;
                    break;
                }
                else
                {
                    this.data[j].Name=event.target.value;
                    this.data[j].Option=['Fix'];
                    this.data[j].DataType=this.d[i].DataType;
                    break;
                }
            }   
        }

    }


     changeOptionFun()
    {
        console.log('OUTPUT : change option',);
        let p=event.target.dataset.option;
        if(event.target.value=='Random')
        {
            this.template.querySelector('[data-input="'+p+'"]').disabled=true;
            this.template.querySelector('[data-input="'+p+'"]').value='';
        }
        else
        {
            this.template.querySelector('[data-input="'+p+'"]').disabled=false;
        }
    }

    createRecordFun()
    {
        this.sendData=[];
        console.log('OUTPUT : create button clicked');
        for(let i=0;i<this.fieldSets.length;i++)
        {
            let m=this.template.querySelectorAll('[data-class="'+i+'"]');
            let fieldVal=m[0].value;
            let option=m[1].value;
            let value=m[2].value;
            let js=
            {
                'Field':fieldVal,
                'Option':option,
                'Value':value
            };
            this.sendData.push(js);
        }
        console.log('OUTPUT : Final Data', JSON.stringify(this.sendData));
        console.log('OUTPUT : type',typeof this.sendData);

        console.log('OUTPUT : ',this.noOfRecords);
        myFun2({'objName':this.objectName,'noOfRec':this.noOfRecords,'finalList':this.sendData})
        .then(result=>{
            console.log('OUTPUT : Run');
        }).catch(error=>{
            console.log('OUTPUT : Error');
        });


    }


   

}