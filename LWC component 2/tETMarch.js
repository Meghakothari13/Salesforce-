import { LightningElement,track} from 'lwc';
import myFun from '@salesforce/apex/TETMarchLwcCLass.myFun';
import myFun1 from '@salesforce/apex/TETMarchLwcCLass.myFun1';
import myFun2 from '@salesforce/apex/TETMarchLwcCLass.myFun2';
import myFun3 from '@salesforce/apex/TETMarchLwcCLass.myFun3';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class TETMarch extends  NavigationMixin(LightningElement) {
    actions = [
    { label: 'View', name: 'view' },
    { label: 'Delete', name: 'delete' }
    ];
    @track columns=[];
    @track userColumns=[
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Username', fieldName: 'Username' },
        {
                type: "button", 
                typeAttributes:{  
                    label: 'Assign',  
                    name: 'Assign',  
                    title: 'Assign',  
                    disabled: false,  
                    iconPosition: 'right'  
                }     
        }   
    ];
    @track data=[];
    @track userData=[];
    @track dataId=[];
    @track userId=[];
    obj;
    connectedCallback() {
        myFun1().then(result=>
        {
            this.userData=result;
        }).catch(error=>{
            console.log('OUTPUT : Error ',error);
        })
    }
    selectObjectFun()
    {
        this.obj=event.target.value;
        console.log('OUTPUT : ',event.target.value);
        this.loadDataFun();
        
    }

    handleRowAction()
    {
        console.log('OUTPUT : Row action clicked' , event.detail.action.name);
        let rowId=event.detail.row.Id;
        if(event.detail.action.name=='view')
        {
            console.log('OUTPUT : if view');
            this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: rowId,
                        actionName: 'view'
                    }
                });
        }
        else if(event.detail.action.name=='delete')
        {
            console.log('OUTPUT : row action delete');
            deleteRecord(rowId)
            .then(() => {
                // this.dispatchEvent(
                //     new ShowToastEvent({
                //         title: 'Success',
                //         message: 'Record deleted',
                //         variant: 'success'
                //     })
                // );
               this.loadDataFun();
              // refreshApex(this.loadDataFun());
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
    }

    handleRowActionButton()
    {
        console.log('OUTPUT : Button Clicked' , event.detail.row.Id);
        let ownerId=event.detail.row.Id;
        myFun2({'idList':this.dataId,'oId':ownerId,'obj':this.obj}).then(()=>
        {
            console.log('OUTPUT : Success');
            this.loadDataFun()
        }).catch(error=>{
            console.log('OUTPUT : error');
        });
    }

    loadDataFun()
    {
        this.data=[];
         if(this.obj=='Case')
        {
            console.log('OUTPUT : if eneterd');
            this.columns =[
                { label: 'Case Number', fieldName: 'CaseNumber' },
                { label: 'Owner Name', fieldName: 'OwnerName' },
                {
                    type: 'action',
                    typeAttributes: {
                        rowActions: this.actions,
                        menuAlignment: 'right'
                    }
                }
            ];
            myFun({'obj':this.obj}).then(result=>{
                let temp=result;
                let arr=[];
                temp.forEach(currentItem => {
                        console.log('OUTPUT : case',currentItem.CaseNumber);
                        arr.push(
                            {
                                'Id':currentItem.Id,
                                'CaseNumber':currentItem.CaseNumber,
                                'OwnerName':currentItem.Owner.Name
                            }
                        );
                    });
                this.data=arr;           
                console.log('test');
            })
            .catch(error=>{
                console.log('OUTPUT : error ',error);
            });

        }
        else
        {
            this.columns=
            [
                { label: 'Name', fieldName: 'Name' },
                { label: 'Owner Name', fieldName: 'OwnerName' },
                {
                    type: 'action',
                    typeAttributes: {
                        rowActions: this.actions,
                        menuAlignment: 'right'
                    }
                }
            ];
            myFun({'obj':this.obj}).then(result=>{
                let temp=result;
                let arr=[];
                temp.forEach(currentItem => {
                    arr.push(
                            {
                                'Id':currentItem.Id,
                                'Name':currentItem.Name,
                                'OwnerName':currentItem.Owner.Name
                            }
                        );
                });            
                this.data=arr;          
            })
            .catch(error=>{
                console.log('OUTPUT : error ',error);
            });
        }
    }

    selectedDataRowHandler()
    {
        this.dataId=[];
        let selectedrows=event.detail.selectedRows;
        console.log('OUTPUT : Selected rows');
        for(let i=0;i<selectedrows.length;i++)
        {
           // console.log('OUTPUT : Id ',selectedrows[i].Id);
            this.dataId.push(selectedrows[i].Id);
        }
        console.log('OUTPUT : ',JSON.stringify(this.dataId));
        //this.dataId=selectedrows;
    }

    selectedUserRowHandler()
    {
        this.userId=[];
        let selectedUserrows=event.detail.selectedRows;
        for(let i=0;i<selectedUserrows.length;i++)
        {
           // console.log('OUTPUT : Id ',selectedrows[i].Id);
            this.userId.push(selectedUserrows[i].Id);
        }

        myFun3({'obj':this.obj,'ownerList':this.userId}).then(result=>
        {
                if(this.obj=='Case')
                {
                    console.log('OUTPUT : if eneterd');
                    this.columns =[
                        { label: 'Case Number', fieldName: 'CaseNumber' },
                        { label: 'Owner Name', fieldName: 'OwnerName' },
                        {
                            type: 'action',
                            typeAttributes: {
                                rowActions: this.actions,
                                menuAlignment: 'right'
                            }
                        }
                    ];
                    let temp=result;
                        let arr=[];
                        temp.forEach(currentItem => {
                                console.log('OUTPUT : case',currentItem.CaseNumber);
                                arr.push(
                                    {
                                        'Id':currentItem.Id,
                                        'CaseNumber':currentItem.CaseNumber,
                                        'OwnerName':currentItem.Owner.Name
                                    }
                                );
                            });
                        this.data=arr;       
                        
                        console.log('test');
                }
                else
                {
                    this.columns=[
                        { label: 'Name', fieldName: 'Name' },
                        { label: 'Owner Name', fieldName: 'OwnerName' },
                        {
                            type: 'action',
                            typeAttributes: {
                                rowActions: this.actions,
                                menuAlignment: 'right'
                            }
                        }
                    ];
                    let temp=result;
                    let arr=[];
                    temp.forEach(currentItem => {
                        arr.push(
                                {
                                    'Id':currentItem.Id,
                                    'Name':currentItem.Name,
                                    'OwnerName':currentItem.Owner.Name
                                }
                            );
                    });  
                    this.data=arr; 
                }
        }).catch(error=>
        {
            console.log('OUTPUT : error in filtering');
        })
    }

    
}