public class LanguageChangeClass {
    
    //final static Map<string,string> langCodeMap=new Map<string,string>();
	
    public static void myFun1(List<Account> accList)
    {
       
        
       List<id> acIdList=new List<Id>();
        for(Account acc:accList)
        {
            
                acIdList.add(acc.Id);
            
        }
        myFun2(acIdList);
        
    }
    
    @future(callout=true)
    public static void myFun2(List<Id> accIdList)
    {
  
        /* langCodeMap.put('English','en');
        langCodeMap.put('Hindi','hi');
        langCodeMap.put('Urdu','ur');
        langCodeMap.put('Gujarati','gu');
        langCodeMap.put('Korean','ko');
        langCodeMap.put('Marathi','mr');
        langCodeMap.put('Punjabi','pa');
        langCodeMap.put('Sindhi','sd');
        langCodeMap.put('Tamil','ta');
        langCodeMap.put('Telugu','te');*/
        //System.debug(langCodeMap);
        
       
        HttpRequest req=new HttpRequest();
        req.setEndpoint('https://google-translate1.p.rapidapi.com/language/translate/v2'); 
        req.setMethod('POST'); 
        req.setHeader('Accept-Encoding','application/gzip');
        req.setHeader('content-type','application/x-www-form-urlencoded');
        req.setHeader('X-RapidAPI-Key', '8c1b9cc7e5mshaa7aa7cca2294b5p12d23ejsn6c8192f53117');
        req.setHeader('X-RapidAPI-Host','google-translate1.p.rapidapi.com');
        List<Account> accList=[select Name,Local_Language__c from Account where Id in:accIdList];
        List<Account> accList1=new List<Account>();
        String s1=UserInfo.getLocale();
        String[] m=s1.split('_');
        System.debug(m[0]);
        String lang=m[0];
        for(Account ac: accList)
        {
            String text=ac.Name;
            System.debug(text);
            //System.debug(ac.Local_Language__c);
            //String lang=langCodeMap.get(ac.Local_Language__c);
           // System.debug(lang);
            String tBody ='q='+EncodingUtil.urlEncode(text, 'UTF-8')+'&target='+EncodingUtil.urlEncode(lang, 'UTF-8');
            req.setBody(tBody);
            HttpResponse res=new httpResponse();
            http htp=new http();
            res = htp.send(req);
            Map<String,Object> langMap=(Map<String,Object>) json.deserializeUntyped(res.getBody());
            System.debug(langMap);
            
            Map<String,Object> map1=(Map<String,Object>)Json.deserializeUntyped(json.serialize(langMap.get('data')));
            System.debug(map1);
            List<Object> list1=(List<Object>)Json.deserializeUntyped(json.serialize(map1.get('translations')));
            String s=json.serialize(list1[0]);
            Map<String,Object> map2=(Map<String,Object>)Json.deserializeUntyped(s);
            
            String n=(String)map2.get('translatedText');
            System.debug(n);
            ac.Name=(string)n;
            accList1.add(ac);
        }
        update accList1;
    }

}