/*
######################################################################
#
# (c) Copyright University of Southampton, 2022
#
# Copyright in this software belongs to University of Southampton,
# Highfield, University Road, Southampton SO17 1BJ
#
# Created By : Stuart E. Middleton
# Created Date : 2022/01/25
# Project : Teaching
# Dependencies:
#   original code UoS authored by Tope Omitola
#
######################################################################
*/

// jxl download from http://jexcelapi.sourceforge.net/
// javac -cp ".;./jexcelapi/jxl.jar" GenerateRDF.java DataItem.java DataSet.java
// java -cp ".;./jexcelapi/jxl.jar" GenerateRDF

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

public class GenerateRDF {

    public ArrayList<Hashtable<String, ArrayList<String>>> get(Workbook workbook) {
        Sheet sheet = workbook.getSheet(0);
        ArrayList<Hashtable<String, ArrayList<String>>> tableContents = new ArrayList<Hashtable<String, ArrayList<String>>>();
        String cellContent;
        Hashtable<String, ArrayList<String>> eachColContents = null;
        //for(int x = 0; x <= 11; x++) { // 11 is the final column with actual data in this table. column 11 is "Other Offences"
        for(int x = 0; x <= 3; x++) { //the range of value column
                Cell[] colCells = sheet.getColumn(x);
            eachColContents = new Hashtable<String, ArrayList<String>>();
            String colKey = colCells[2].getContents(); // real data starts at column cell 2
            ArrayList<String> colValues = new ArrayList<String>();
            //int colLengthOfInterest = 65;
            int colLengthOfInterest = 17;
            for (int i = 0; i < colLengthOfInterest; i++) { // column value data starts at column cell 5
                cellContent = colCells[i].getContents();
                if(cellContent.length() > 0) {
                    colValues.add(cellContent);
                }
            }
            eachColContents.put(colKey, colValues);
            tableContents.add(eachColContents);
        }
        return tableContents;
    }

    public void printSchemaFile() {

        PrintWriter outputSchemaFile =  null;
        // output into  file
        try {

            outputSchemaFile =  new PrintWriter(new BufferedWriter(new FileWriter("covid_test.ttl")));

            // output the schema first and some initial data
            // Martin Szomzor advised to correct these 15:00 27 Nov 2009 Friday
            //outputSchemaFile.println("@prefix : <http://enakting.ecs.soton.ac.uk/statistics/data/> .");
            outputSchemaFile.println("@prefix : <http://enakting.org/schema/crime/> .");
            outputSchemaFile.println("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .");
            outputSchemaFile.println("@prefix dc: <http://purl.org/dc/elements/1.1/> .");
            outputSchemaFile.println("@prefix owl: <http://www.w3.org/2002/07/owl#> .");
            outputSchemaFile.println("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
            outputSchemaFile.println("@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .");
            //outputSchemaFile.println("@prefix scovo: <http://purl.org/NET/scovo#> .");
            outputSchemaFile.println("@prefix qb : <http://purl.org/linked-data/cube#>");
            //outputSchemaFile.println("@prefix statistics: <http://enakting.ecs.soton.ac.uk/statistics/> .");
            //outputSchemaFile.println("@base <http://enakting.ecs.soton.ac.uk/statistics/data/> . \n");

            outputSchemaFile.println("#Dimension - table \n");
            outputSchemaFile.println(":TimePeriod rdf:type owl:Class ;");
            outputSchemaFile.println("\t rdfs:subClassOf qb:Dimension . \n");

            outputSchemaFile.println("#Dimension - row");
            outputSchemaFile.println(":DifferentIndustry rdfs:subClassOf scovo:Dimension;");
            outputSchemaFile.println(" \t dc:title \"business impact of Covid-19\". \n");

            outputSchemaFile.println("#Dimensions - columns");
            outputSchemaFile.println(":SizeType rdf:type owl:Class ;");
            outputSchemaFile.println("\t rdfs:subClassOf qb:Dimension .");
        } catch(IOException ioex) {
            System.out.println(ioex);
        }

        outputSchemaFile.close();


    }

    public static void main(String[] args) {

        Workbook workbook = null;

        try {
            workbook = Workbook.getWorkbook(new File("D:/semester2/newtest/src/covid_test2.xls"));
        } catch (BiffException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        GenerateRDF enakting = new GenerateRDF();
        ArrayList<Hashtable<String, ArrayList<String>>> wkBookSheetContents = enakting.get(workbook);

        // set up the 50 DataSet objects
        DataSet[] allRegions = new DataSet[16];//this parameter must be the number of value row
        for(int i = 0; i < allRegions.length; i++) {
            allRegions[i] = new DataSet();
        }
        // the lines here fill in data into the 50 DataSet objects
        Hashtable<String, ArrayList<String>> regions = wkBookSheetContents.get(0);
        Set<Map.Entry<String, ArrayList<String>>> regionsEntrySet = regions.entrySet();
        Iterator<Entry<String, ArrayList<String>>> iter = regionsEntrySet.iterator();
        while(iter.hasNext()) {
            Map.Entry<String, ArrayList<String>> elem = iter.next();
            ArrayList<String> values = elem.getValue();
            //System.out.println(values);
            for(int i = 0; i < values.size(); i++) {
                //System.out.println(values.get(i));
                allRegions[i].setRegionName(values.get(i));
            }
        }

        // the lines here set up the DataItems, which are subsets of DataSets
        for(int i = 1; i < wkBookSheetContents.size(); i++) {
            int rowNumber = i;
            Hashtable<String, ArrayList<String>> tempColContent = wkBookSheetContents.get(i);
            Set<Map.Entry<String, ArrayList<String>>> tempColContentSet = tempColContent.entrySet();
            Iterator<Entry<String, ArrayList<String>>> iter2 = tempColContentSet.iterator();
            while(iter2.hasNext()) {
                Map.Entry<String, ArrayList<String>> elem = iter2.next();
                String itemName = elem.getKey();
                ArrayList<String> values = elem.getValue();
                for(int x = 0; x < values.size(); x++) {
                    String itemValue = values.get(x);
                    int cellNumber = x + 1;
                    DataItem dataItem = new DataItem(itemName, itemValue,  (cellNumber +  "_" + rowNumber)); // this cell number is a quick fix. Come back to fix properly. At present, I invert to get the right cell number.
                    allRegions[x].addDataItem(dataItem);
                }
            }
        }

        // output starts ...
        // print the schema
        enakting.printSchemaFile();

        // output the data set

        PrintWriter outputDataFile = null;;

        // output into  files
        try {

            outputDataFile =  new PrintWriter(new BufferedWriter(new FileWriter("covidsData.ttl")));

            // output the schema first and some initial data
            outputDataFile.println("@prefix : <http://industryInCovid.psi.enakting.org/data/> .");//changed one

            outputDataFile.println("@prefix owl: <http://www.w3.org/2002/07/owl#> .");
            outputDataFile.println("@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .");
            outputDataFile.println("@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .");
            outputDataFile.println("@prefix qb: <http://purl.org/linked-data/cube#> .");
            outputDataFile.println("@prefix industry: <http://enakting.org/schema/industryInCovid/> .\n");
            outputDataFile.println("@prefix value: <http://www.example.org/value> .\n");
            outputDataFile.println("@prefix dimension1: <http://www.example.org/dimension1> .\n");
            outputDataFile.println("@prefix dimension2: <http://www.example.org/dimension2> .\n");
            outputDataFile.println(" @prefix CW_businessImpactInCovid19: <http://cw1.comp6214.org/covid19/schema> \n");
            // now print the rows
            for(int z = 0; z < allRegions.length; z++) {
                System.out.println(allRegions.length);
                outputDataFile.println(":" + allRegions[z].getRegionNameLabel() + " rdf:type Business: DifferentIndustry;");//adjustment
                outputDataFile.println("\t dc:title \"" + allRegions[z].getRegionName() + "\"." + "\n");
            }

            // start preparing to print the columns
            // now print the columns
            for(int a = 0; a < allRegions.length; a++) {
                ArrayList<DataItem> dataItems = (ArrayList<DataItem>) allRegions[a].getDataItems();
                for(int b = 0; b < dataItems.size(); b++) {
                    DataItem dI = dataItems.get(b);
                    outputDataFile.println(":" + dI.getItemLabel() + " rdf:type :NumberOfDifferentSamples;");
                    outputDataFile.println("\t dc:title " + "\"" + dI.getItemTitle() + "\"." + "\n");
                }
            }

            outputDataFile.println("#Dataset");
            outputDataFile.println(":ds1 rdf:type qb:Dataset;");
            outputDataFile.println("\t dc:title \"influence of different industry in covid19\";");
            for(int d = 1; d < allRegions.length; d++) {
                ArrayList<DataItem> dataItems = (ArrayList<DataItem>) allRegions[d].getDataItems();
                int e = 0;
                DataItem dI = null;
                for( ; e < dataItems.size(); e++) {
                    dI = dataItems.get(e);
                    if( (d == (allRegions.length - 1) && e == (dataItems.size() - 1)) == false ) {
                        outputDataFile.println("\t qb:datasetOf :ds1_" + dI.getCellNumber() + ";");
                    } else {
                        // print if this is the last one in the series
                        outputDataFile.println("\t qb:datasetOf :ds1_" + dI.getCellNumber());
                    }
                }
            }
            outputDataFile.println("\t . \n");

            // the lines here output the DataSets and in them the DataItems
            for(int y = 0; y < allRegions.length; y++) {
                outputDataFile.println(allRegions[y].toString());
            }

        } catch(IOException ioex) {
            System.out.println(ioex);
        }

        outputDataFile.close();
    }
}


