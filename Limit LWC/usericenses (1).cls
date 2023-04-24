public class usericenses {
    
    @AuraEnabled(cacheable=true)
    public static List<UserLicense> myFun1()
    {
     /*   List<UserLicense> userLicenseList=[select Id, Name, UsedLicenses, TotalLicenses from UserLicense];
        system.debug(userLicenseList);
        */
        return [select Id, Name, UsedLicenses, TotalLicenses from UserLicense];
       
    }



    @AuraEnabled(cacheable=true)
    public static List<String> myFun2()
    {
        List<string> str=new List<string>();  
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe(); 
        Set<String> standardObjects = new Set<String>();
        Set<String> customObjects = new Set<String>();
        for(Schema.SObjectType d : gd.values())
        {
            Schema.DescribeSObjectResult ds = d.getDescribe();
            
            system.debug('data'+ ds);
            
            if(!ds.isCreateable())
            continue;
            if(ds.isCustom() == false && ds.getRecordTypeInfos().size() > 0)
                standardObjects.add(ds.getName());
            else if(ds.isCustom())
                customObjects.add(ds.getName());
        }
        List<String> sortedNames = new List<String>(customObjects);
        sortedNames.sort();
        for(String name : sortedNames)
        {
             str.add(name);
             System.debug('Custom object: ' + name);
        }
        
        sortedNames = new List<String>(standardObjects);
        sortedNames.sort();
            for(String name : sortedNames){
                str.add(name);
            }
            
            str.sort();
            return str;
    }

    @AuraEnabled(cacheable=true)     
    public static List<Integer> fieldDetails(String objApiName)
    {
        Integer ff=0;
        Integer mdr=0;
        Integer lu=0;
        Integer ru=0;
        sObjectType objectType=Schema.getGlobalDescribe().get(objApiName);
        System.debug(objectType); 

        Schema.DescribeSObjectResult d =objectType.getDescribe();
        Map<String, Schema.SObjectField> FsMap = d.fields.getMap();
            system.debug(FsMap.keyset());
            for(Schema.SObjectField sfield : FsMap.Values())
            {
            
                Schema.DescribeFieldResult  temp=sfield.getDescribe();
                //system.debug('data' + temp);
            // system.debug('Name==>'+sfield+'--->'+temp.isCascadeDelete());
                if(temp.isCalculated())
                {
                    if(temp.getCalculatedFormula() == null)
                    ru++;
                    else
                    ff++;
                }
                    
                else if(String.valueOf(temp.getType()) == 'REFERENCE')
                {
                if(temp.isCascadeDelete())
                mdr++;
                else
                    lu++;
                } 
                                
            }
        List<Integer> intList=new Integer[]{};
        intList.add(FsMap.size());intList.add(ff);intList.add(ru);intList.add(mdr);intList.add(lu);

        system.debug(intList);    
        return intList;
    }

}