public class TETMarchLwcCLass {

    @AuraEnabled
    public static List<sObject> myFun(String obj)
    {
        String objStr;
        System.debug('Object'+obj);
        if(obj=='Case')
        {
            objStr='Select CaseNumber,Owner.Name from ' +obj+ ' Order By Id Desc Limit 20';
        }
        else
        {
            objStr='Select Name,Owner.Name from ' + obj+ ' Order By Id Desc Limit 20';
        }

        System.debug(database.query(objStr));
        return database.query(objStr);
    } 

    @AuraEnabled
    public static List<user> myFun1(String obj)
    {
        
        return ([Select Name,Email,Username from User]);
    } 

    @AuraEnabled
    public static void myFun2(List<Id> idList,Id oId,String obj)
    {

        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();    
        List<sObject> updateList=new list<sObject>();
        System.debug(idList.size());
        for(Integer i=0;i<idList.size();i++)
        {
            Schema.SObjectType st = gd.get(obj);
            Sobject s = st.newSobject();
            System.debug(idList[i]);
            s.put('Id',idList[i]);
            s.put('OwnerId',oId);
            System.debug(s);
            updateList.add(s);
        }
        
        System.debug(updateList);
        Database.update(updateList,false);
    }

    @AuraEnabled
    public static list<sObject> myFun3(String obj,List<Id> ownerList)
    {
        String str='';
        
        if(obj=='Case')
        {
            if(ownerList.size()==0)
            {
                str='Select CaseNumber,Owner.Name from '+obj+' Order By Id Desc';
            }
            else
            {
                str='Select CaseNumber,Owner.Name from '+obj+' where OwnerId in :ownerList';
            }
        }
        else
        {
            if(ownerList.size()==0)
            {
                str='Select Name,Owner.Name from '+obj+' Order By Id Desc';
            }
            else
            {
                str='Select Name,Owner.Name from '+obj+' where OwnerId in :ownerList';
            }
        }
        return (Database.query(str));
    }

}