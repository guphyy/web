import java.util.ArrayList;


public  class DataSet {

    private String _regionName, _regionNameLabel ;
    private ArrayList<DataItem> _dataItems = new ArrayList<DataItem>();

    public DataSet() {

    }

    public DataSet(String region) {
        _regionName = region;
    }

    public void setRegionName(String regionName) {
        _regionName = regionName;
    }

    public String getRegionName() {
        return _regionName ;
    }
    public String getRegionNameLabel() {
        _regionNameLabel = _regionName;
        //System.out.println(_regionName+" test");
        String[] regionNameWithSpaces = _regionName.split("\\s+");//ignore the blank row, it is unuseful？
        if(regionNameWithSpaces.length > 0) {
            String regionNameWithSpacesNew = new String();
            for (int y = 0 ; y < regionNameWithSpaces.length ; y++)  {
                regionNameWithSpacesNew += regionNameWithSpaces[y];
            }
            _regionNameLabel = regionNameWithSpacesNew ;
        }
        // search for pesky "," xter in London,CityOf
        String[] regionNameWithCommas = _regionName.split(", ");
        if(regionNameWithCommas.length >= 2) {
            System.out.println("_industryName = " + _regionName);
            _regionNameLabel =   "dataOf" + regionNameWithCommas[0];
            System.out.println("_industryNameLabel = " + _regionNameLabel);
        }

        return _regionNameLabel;
    }

    public void addDataItem(DataItem dataItem) {
        _dataItems.add(dataItem);
    }

    public ArrayList<DataItem> getDataItems() {
        return _dataItems;
    }

    public String toString() {
        String dataSetStr = new String();
        for(int i = 0; i < _dataItems.size(); i++) {
            dataSetStr += _dataItems.get(i).toString() + "\t qb:dimension2 :" + getRegionNameLabel().replace(" ","").replace(";","") + " .  \n \n" ;
        }
        return dataSetStr;
    }


}
