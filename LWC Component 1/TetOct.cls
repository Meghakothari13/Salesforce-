public class TetOct {
    
    @AuraEnabled(cacheable=true)
    public static Map<String,String> myFun1(String objName)
    {
        Map<String,String> fsMap=new Map<String,String>();
        DescribeSObjectResult[] describes = Schema.describeSObjects(new String[] {
                objName
            });

        Schema.FieldSet fs = describes[0].fieldSets.getMap().get('Name');
        System.debug(fs.fields);
       List<Schema.FieldSetMember> fsmList=fs.fields;
        for(Schema.FieldSetMember fsm:fsmList)
        {
            System.debug('0------------------------0');
            System.debug(fsm.getLabel());
            String objType=String.valueOf(fsm.getType());
            fsMap.put(fsm.getLabel(),objType);
        }
        
        System.debug('Map shiwn-----------------');
        System.debug(fsMap);
        return fsMap;
    }

    @AuraEnabled
    public static void myFun2(String objName,Integer noOfRec, List<Object> finalList)
    {

        System.debug(finalList);
        System.debug(noOfRec);
        List<TETOctWrapper> dataList=TETOctWrapper.parse(JSON.serialize(finalList));
        System.debug(dataList);
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType leadSchema = schemaMap.get(objName);
        Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
        Map<String,List<String>> fieldApiMap=new Map<String,List<String>>();
        
        List<sObject> insertList=new List<sObject>();
        for(String fieldName:fieldMap.keySet())
        {
            for(TETOctWrapper dl:dataList)
            {
                if(dl.Field==fieldMap.get(fieldName).getDescribe().getLabel())
                {
                    String dt=String.valueOf(fieldMap.get(fieldName).getDescribe().getType());
                    List<String> sList=new List<String>();
                    sList.add(fieldName);
                    sList.add(dt);
                    System.debug(fieldName);
                    fieldApiMap.put(dl.Field,sList);
                }
            }
        }
        
        System.debug('Api Map'+ fieldApiMap);
        for(Integer i=0;i<noOfRec;i++)
        {
            System.debug('for first enetred');
            sObject sobj=Schema.getGlobalDescribe().get(objName).newsObject();
            for(TETOctWrapper dl:dataList)
            {
                System.debug(dl.Field);       
                System.debug(dl.Value);
                System.debug(dl.Option);            
                System.debug('------------------');
                if(dl.Option=='Random')
                {
                    if(dl.Value=='')
                    {
                        if(fieldApiMap.get(dl.Field)[1]=='CURRENCY')
                        {
                            Decimal val=Decimal.valueof((Math.random() * 100000));
                            System.debug('random if entered');
                            sobj.put(fieldApiMap.get(dl.Field)[0],val); 
                        }
                        else if(fieldApiMap.get(dl.Field)[1]=='INTEGER')
                        {
                            Integer val=Integer.valueof((Math.random() * 1000));
                            System.debug('random if entered');
                            sobj.put(fieldApiMap.get(dl.Field)[0],val); 
                        }
                        
                    }
                }
                else if(dl.Option=='Fix')
                {
                    if(fieldApiMap.get(dl.Field)[1]=='CURRENCY')
                    {
                        sobj.put(fieldApiMap.get(dl.Field)[0],Decimal.valueof(dl.Value)); 
                    }
                    else if(fieldApiMap.get(dl.Field)[1]=='INTEGER')
                    {
                        sobj.put(fieldApiMap.get(dl.Field)[0],Integer.valueof(dl.Value)); 
                    }    
                    else
                    {
                        sobj.put(fieldApiMap.get(dl.Field)[0],dl.Value);
                    }
                }
                
            }        
            System.debug(sobj);
            insertList.add(sobj);
        }
        
        
        Database.insert(insertList,false);
        


    }

}