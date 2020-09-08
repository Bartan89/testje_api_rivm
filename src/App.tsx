import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import Axios from "axios"
import "./App.css"

function App() {
  const [data, fetchData] = useState(false)

  const [fetchedData, setFetchesData] = useState([])

  useEffect((): any => {
    return async function fetchAPI() {
      try {
        console.log("test")
        const response: any = await Axios.get("https://services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Coronavirus_RIVM_vlakken_actueel/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=")

        console.log(response.data.features)

        setFetchesData(response.data.features)
      } catch (error) {
        console.log(error.message)
      }
    }
  }, [data])

  function fetchDataFromApi() {
    fetchData(true)
  }

  return (
    <div className="App">
      <table>
        <button onClick={fetchDataFromApi}>click me</button>

        <table>
          {fetchedData.map((element: any) => {
            return (
              <>
                <tr>In {element.attributes.Gemeentenaam}</tr>
                <tr>Doden: {element.attributes.Overleden}</tr>
                <tr>Ziekenhuisopnamen: {element.attributes.Ziekenhuisopnamen}</tr>
              </>
            )
          })}
        </table>
      </table>
    </div>
  )
}

export default App
