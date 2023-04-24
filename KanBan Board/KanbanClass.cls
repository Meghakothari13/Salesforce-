public class KanbanClass {

    @AuraEnabled
    public static List<Event__c> fetchEvent()
    {
        try 
        {
            return[Select Id,Name,Account__c,Account__r.Name,Criticalness__c,Stages__c,Description__c from Event__c Order By CreatedDate DESC];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateEvents(List<Event__c> evList)
    {
        Database.update(evList,false);
    }

    @AuraEnabled
    public static List<Event__c> getDetails(Id recId)
    {
         return[Select Id,Name,Account__c,Account__r.Name,Account__r.BillingCity,Criticalness__c,Stages__c,Description__c from Event__c where Id =:recId];
    }
}