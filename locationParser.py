from xml.etree import ElementTree as ET
import re
import json


# XML data provided
xml_data = """
  <Document>
    <name>Montréal Métro</name>
    <description>Subway stations in Montréal, Quebec, Canada</description>
    <Style id="icon-503-DB4436-normal">
      <IconStyle>
        <color>ff3644db</color>
        <scale>1.1</scale>
        <Icon>
          <href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
        </Icon>
        <hotSpot x="16" xunits="pixels" y="32" yunits="insetPixels"/>
      </IconStyle>
      <LabelStyle>
        <scale>0</scale>
      </LabelStyle>
    </Style>
    <Style id="icon-503-DB4436-highlight">
      <IconStyle>
        <color>ff3644db</color>
        <scale>1.1</scale>
        <Icon>
          <href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
        </Icon>
        <hotSpot x="16" xunits="pixels" y="32" yunits="insetPixels"/>
      </IconStyle>
      <LabelStyle>
        <scale>1.1</scale>
      </LabelStyle>
    </Style>
    <StyleMap id="icon-503-DB4436">
      <Pair>
        <key>normal</key>
        <styleUrl>#icon-503-DB4436-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#icon-503-DB4436-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="icon-503-DB4436-nodesc-normal">
      <IconStyle>
        <color>ff3644db</color>
        <scale>1.1</scale>
        <Icon>
          <href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
        </Icon>
        <hotSpot x="16" xunits="pixels" y="32" yunits="insetPixels"/>
      </IconStyle>
      <LabelStyle>
        <scale>0</scale>
      </LabelStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <Style id="icon-503-DB4436-nodesc-highlight">
      <IconStyle>
        <color>ff3644db</color>
        <scale>1.1</scale>
        <Icon>
          <href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
        </Icon>
        <hotSpot x="16" xunits="pixels" y="32" yunits="insetPixels"/>
      </IconStyle>
      <LabelStyle>
        <scale>1.1</scale>
      </LabelStyle>
      <BalloonStyle>
        <text><![CDATA[<h3>$[name]</h3>]]></text>
      </BalloonStyle>
    </Style>
    <StyleMap id="icon-503-DB4436-nodesc">
      <Pair>
        <key>normal</key>
        <styleUrl>#icon-503-DB4436-nodesc-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#icon-503-DB4436-nodesc-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="line-33CC00-7000-normal">
      <LineStyle>
        <color>ff00cc33</color>
        <width>7</width>
      </LineStyle>
    </Style>
    <Style id="line-33CC00-7000-highlight">
      <LineStyle>
        <color>ff00cc33</color>
        <width>10.5</width>
      </LineStyle>
    </Style>
    <StyleMap id="line-33CC00-7000">
      <Pair>
        <key>normal</key>
        <styleUrl>#line-33CC00-7000-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#line-33CC00-7000-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="line-33CCFF-5000-normal">
      <LineStyle>
        <color>ffffcc33</color>
        <width>5</width>
      </LineStyle>
    </Style>
    <Style id="line-33CCFF-5000-highlight">
      <LineStyle>
        <color>ffffcc33</color>
        <width>7.5</width>
      </LineStyle>
    </Style>
    <StyleMap id="line-33CCFF-5000">
      <Pair>
        <key>normal</key>
        <styleUrl>#line-33CCFF-5000-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#line-33CCFF-5000-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="line-FF6600-5000-normal">
      <LineStyle>
        <color>ff0066ff</color>
        <width>5</width>
      </LineStyle>
    </Style>
    <Style id="line-FF6600-5000-highlight">
      <LineStyle>
        <color>ff0066ff</color>
        <width>7.5</width>
      </LineStyle>
    </Style>
    <StyleMap id="line-FF6600-5000">
      <Pair>
        <key>normal</key>
        <styleUrl>#line-FF6600-5000-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#line-FF6600-5000-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Style id="line-FFFF33-5000-normal">
      <LineStyle>
        <color>ff33ffff</color>
        <width>5</width>
      </LineStyle>
    </Style>
    <Style id="line-FFFF33-5000-highlight">
      <LineStyle>
        <color>ff33ffff</color>
        <width>7.5</width>
      </LineStyle>
    </Style>
    <StyleMap id="line-FFFF33-5000">
      <Pair>
        <key>normal</key>
        <styleUrl>#line-FFFF33-5000-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#line-FFFF33-5000-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Folder>
      <name>Untitled layer</name>
      <Placemark>
        <name>Bonaventure</name>
        <description>http://www.stm.info/english/metro/a-m15.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.566674,45.498457,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name><![CDATA[Lucien-L'Allier]]></name>
        <description>http://www.stm.info/english/metro/a-m16.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.570804,45.494841,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Villa Maria</name>
        <description>http://www.stm.info/english/metro/a-m48.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.619814,45.480294,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Vendôme</name>
        <description>http://www.stm.info/english/metro/a-m47.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.603334,45.472892,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Lionel-Groulx</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.579677,45.482832,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Place-Saint-Henri </name>
        <description>http://www.stm.info/english/metro/a-m46.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.586404,45.477015,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Côte-Vertu</name>
        <description>http://www.stm.info/english/metro/a-m65.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.683628,45.513804,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Du Collège Metro</name>
        <description><![CDATA[<img src="https://lh3.googleusercontent.com/umsh/AD1GIHMSlL8KdMsKbLqgyKvQ7KrDFbDL9G_kGUOxaG0QTNHAeJNN0VdFSd84zPEexus6As9Fzxt9ahIlDSLsvIYWwLnJnzHs3QHSgjksW2nJL3ixdhmvokQJrtp8Pw" height="200" width="auto" /><br><br>http://www.stm.info/english/metro/a-m54.htm]]></description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <ExtendedData>
          <Data name="gx_media_links">
            <value>https://lh3.googleusercontent.com/umsh/AD1GIHMSlL8KdMsKbLqgyKvQ7KrDFbDL9G_kGUOxaG0QTNHAeJNN0VdFSd84zPEexus6As9Fzxt9ahIlDSLsvIYWwLnJnzHs3QHSgjksW2nJL3ixdhmvokQJrtp8Pw</value>
          </Data>
        </ExtendedData>
        <Point>
          <coordinates>
            -73.674616,45.509414,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>De la Savane</name>
        <description>http://www.stm.info/english/metro/a-m53.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.659853,45.49812,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Namur</name>
        <description>http://www.stm.info/english/metro/a-m52.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.653115,45.495066,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Plamondon</name>
        <description>http://www.stm.info/english/metro/a-m51.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.640756,45.495517,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Côte-Sainte-Catherine</name>
        <description>http://www.stm.info/english/metro/a-m50.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.632773,45.492449,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Snowdon</name>
        <description>http://www.stm.info/english/metro/a-m49.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.627667,45.48586,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Georges-Vanier</name>
        <description>http://www.stm.info/english/metro/a-m17.htm</description>
        <styleUrl>#icon-503-DB4436</styleUrl>
        <Point>
          <coordinates>
            -73.576511,45.48884,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Angrignon</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.604622,45.446643,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Monk</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.593227,45.451144,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Jolicoeur</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.581768,45.456654,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Verdun</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.571726,45.459107,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name><![CDATA[De l'Église]]></name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.567027,45.462598,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Lasalle</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.56662,45.47086,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Charlevoix</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.569388,45.478029,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Atwater</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.586275,45.48969,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Guy-Concordia</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.579741,45.495218,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Peel</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.574978,45.500729,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>McGill</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.571426,45.50421,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Place-des-Arts</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.568433,45.507902,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Saint-Laurent</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.564625,45.510806,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Berri-UQAM</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.56103,45.515338,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Beaudry</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.555826,45.519089,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Papineau</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.551771,45.523586,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Frontenac</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.551985,45.533289,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Préfontaine</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.554196,45.541676,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Joliette</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.551299,45.546987,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Pie-IX</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.551771,45.553854,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Viau</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.547019,45.561321,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Assomption</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.546953,45.569397,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Cadillac</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.546599,45.576869,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Langelier</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.543103,45.582748,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Radisson</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.539466,45.588898,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Honoré-Beaugrand</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.535259,45.596713,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Côte-des-Neiges</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.622904,45.496436,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Université-de-Montréal</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.618161,45.502285,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Edouard-Montpetit</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.612132,45.509956,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Outremont</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.614834,45.520105,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Acadie</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.623569,45.523383,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Parc</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.62417,45.530343,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Square-Victoria</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.560654,45.50097,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name><![CDATA[Place-d'Armes]]></name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.559797,45.505986,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Square-Victoria</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.560654,45.500962,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Champ-de-Mars</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.556631,45.510196,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Sherbrooke</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.56898,45.518895,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Mont-Royal</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.581554,45.524765,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Laurier</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.588066,45.528027,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Rosemont</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.597787,45.531801,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Beaubien</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.604826,45.535001,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Jarry</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.62934,45.54338,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Crémazie</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.638256,45.545974,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Sauvé</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.655906,45.550826,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Henri-Bourassa</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.667783,45.554237,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>De Castelneau</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.619985,45.535108,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Jean-Talon</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.613676,45.538805,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Fabre</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.608012,45.546424,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name><![CDATA[D'Iberville]]></name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.602046,45.553938,0
          </coordinates>
        </Point>
      </Placemark>
      <Placemark>
        <name>Saint-Michel</name>
        <styleUrl>#icon-503-DB4436-nodesc</styleUrl>
        <Point>
          <coordinates>
            -73.599601,45.558925,0
          </coordinates>
        </Point>
      </Placemark>
    </Folder>
  </Document>
"""

from xml.etree import ElementTree as ET

def extract_subway_stations(xml_data, output_file):
    """
    Extracts subway station information from XML data.

    Args:
    xml_data (str): A string containing XML data.

    Returns:
    list: A list of dictionaries with 'name', 'location', and 'line' for each subway station.
    """
    root = ET.fromstring(xml_data)

    subway_stations = []
    for placemark in root.findall('.//Placemark'):
        name = placemark.find('name').text
        style_url = placemark.find('styleUrl').text
        coordinates = placemark.find('.//coordinates').text

        # Extracting latitude and longitude
        long, lat, _ = map(float, coordinates.split(','))

        # Creating a dictionary for each subway station
        station_info = {
            "name": name,
            "location": {"lat": lat, "long": long},
            "line": style_url
        }
        subway_stations.append(station_info)
    print(subway_stations)
# Saving the data to a JSON file
    with open(output_file, 'w') as file:
        json.dump(subway_stations, file, indent=4)


extract_subway_stations(xml_data, 'subway_stations.json')
