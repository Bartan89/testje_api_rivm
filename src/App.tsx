import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import Axios from "axios"
import "./App.css"
import { isRegExp } from "util"

type Attributes = {
  Bevolkingsaantal: number
  Datum: number
  GGD_regio: string
  GGD_regiocode: string
  GGD_regionummer: number
  Gemeentecode: number
  Gemeentenaam: string
  Gemeentenummer: number
  Meldingen: number
  Meldingen_100000: number
  ObjectId: number
  Overleden: number
  Overleden_100000: number
  Provincie: string
  Provinciecode: string
  Provincienummer: number
  Shape__Area: number
  Shape__Length: number
  Veiligheidsregio: string
  Veiligheidsregiocode: string
  Veiligheidsregionummer: number
  Ziekenhuisopnamen: number
  Ziekenhuisopnamen_100000: number
}

type CompleteData = {
  attributes: Attributes
}

function App() {
  const [data, fetchData] = useState(false)

  const [gemeentes, setGemeentes] = useState([])
  const [gemeentesFiltered, setGemeentesFiltered] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [showlist, setShowlist] = useState(false)
  const [completeData, setCompleteData] = useState<CompleteData[]>()
  const [foundRecord, setFoundRecord] = useState<CompleteData>()

  useEffect((): any => {
    async function fetchAPI() {
      try {
        console.log("test")
        const response: any = await Axios.get("https://services.arcgis.com/nSZVuSZjHpEZZbRo/arcgis/rest/services/Coronavirus_RIVM_vlakken_actueel/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=")

        setCompleteData(response.data.features)

        console.log("dit is complete data:", response.data.features)

        const gemeentes = response.data.features.map((element: any) => {
          return element.attributes.Gemeentenaam
        })

        console.log("dit zijn de gemeentes", gemeentes)

        setGemeentes(gemeentes)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchAPI()
  }, [])

  function fetchDataFromApi() {
    fetchData(true)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const userInput = e.target.value
    if (userInput.length > 0) {
      setShowlist(true)
    } else {
      setShowlist(false)
    }
    setInput(userInput)

    const filtered = gemeentes.filter((gemeente: string) => {
      if (gemeente.toLowerCase().includes(userInput.toLowerCase())) {
        return true
      } else {
        return false
      }
    })
    setGemeentesFiltered(filtered)
  }

  function handleAutoCompleteClick(gemeente: string) {
    setInput(gemeente)
  }

  function handleEnterPress(e: any) {
    if (e.key === "Enter") {
      setInput(e.target.id)
      if (completeData !== undefined) {
        const searched = completeData.find((element: any) => {
          return element.attributes.Gemeentenaam === input
        })
        setFoundRecord(searched)
        setShowlist(!showlist)
      }
    }
  }

  function handleSearchbtn() {
    if (completeData !== undefined) {
      const searched = completeData.find((element: any) => {
        return element.attributes.Gemeentenaam === input
      })
      setFoundRecord(searched)
      setShowlist(!showlist)
    }
  }

  console.log("****", foundRecord)

  const [showMore, setShowMore] = useState<Boolean>(true)

  function toggleShowMore() {
    setShowMore(!showMore)
  }

  return (
    <div className="main">
      <div className="searcharea">
        <input placeholder="bijv: Amsterdam" value={input} onChange={handleInput} type="text" />
        <button onClick={handleSearchbtn}>search</button>

        <div style={{ alignContent: "center" }}>
          {showlist
            ? gemeentesFiltered.map((gemeente, i) => {
                {
                  if (i === 20) {
                    if (showMore) {
                      return <button onClick={toggleShowMore}>show more</button>
                    }
                  }
                  if (i > 20) {
                    if (showMore) {
                      return ""
                    }
                  }
                  if (i === gemeentesFiltered.length - 1 && !showMore) {
                    return <button onClick={toggleShowMore}>show less</button>
                  }
                }

                return (
                  <div onClick={() => handleAutoCompleteClick(gemeente)}>
                    <small id={gemeente} tabIndex={0} onKeyDown={handleEnterPress} style={{ display: "block", cursor: "pointer" }}>
                      {gemeente}
                    </small>
                  </div>
                )
              })
            : ""}
        </div>
      </div>
      {foundRecord ? (
        <div className="table">
          <table>
            <tr>
              <th>Provincie:</th>
              <td>{foundRecord?.attributes.Provincie}</td>
            </tr>
            <tr>
              <th>Veiligheids regio:</th>
              <td>{foundRecord?.attributes.Veiligheidsregio}</td>
            </tr>
            <tr>
              <th>Ziekenhuisopnamen:</th>
              <td>{foundRecord?.attributes.Ziekenhuisopnamen}</td>
            </tr>
            <tr>
              <th>Overleden:</th>
              <td>{foundRecord?.attributes.Overleden}</td>
            </tr>
          </table>
        </div>
      ) : (
        <div className="table"></div>
      )}
    </div>
  )
}

export default App
