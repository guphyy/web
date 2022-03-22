public  class DataItem {

    private String _itemTitle, _itemValue, _itemLabel, _cellNumber ;

    public DataItem() {

    }

    public DataItem(String itemName, String itemValue, String cellNumber) {
        _itemTitle = itemName;
        _itemValue = itemValue;
        _cellNumber = cellNumber;
    }

    public String getItemTitle() {
        return _itemTitle;
    }

    public String getItemValue() {
        return _itemValue;
    }

    public String getItemLabel() {
        _itemLabel = _itemTitle;
        String[] offenceType = _itemTitle.split("\\s+");
        if(offenceType.length > 0) {
            String offenceTypeNew = new String();
            for (int y = 0 ; y < offenceType.length ; y++)  {
                if(offenceType[y].length() > 1){
                    offenceTypeNew += offenceType[y];
                }

            }
            _itemLabel = offenceTypeNew ;
            System.out.println(_itemLabel);
        }
        return _itemLabel;
    }

    public String getCellNumber() {
        return _cellNumber;
    }

    public String toString() {
        getItemLabel();
        if(getCellNumber().charAt(getCellNumber().length() - 1) == '1'){
            return ":ds1_" + getCellNumber() + " rdf:type qb:Item; \n" +
                    "\t rdf:value " + _itemValue.replace(" ","").replace("<","Less") + "; \n" +
                    "\t qb:dataset :ds1; \n" +
                    "\t qb:dimension1 :" + "SizeLessThan250" + "; \n"
                    ;
        }
        else if(getCellNumber().charAt(getCellNumber().length() - 1) == '2'){
            return ":ds1_" + getCellNumber() + " rdf:type qb:Item; \n" +
                    "\t rdf:value " + _itemValue.replace(" ","").replace("+","More") + "; \n" +
                    "\t qb:dataset :ds1; \n" +
                    "\t qb:dimension1 :" + "SizeMoreThan250" + "; \n"
                    ;
        }
        else{
            return ":ds1_" + getCellNumber() + " rdf:type qb:Item; \n" +
                    "\t rdf:value " + _itemValue + "; \n" +
                    "\t qb:dataset :ds1; \n" +
                    "\t qb:dimension1 :" + "Total" + "; \n"
                    ;
        }

    }
}
