import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { Box, Paper } from "@material-ui/core";
import DatabaseJSONProps from "../../types/DatabaseProps";
import CityFilter from "../CityFilter";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  Title,
  Tooltip,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker } from "@devexpress/dx-react-chart";
import BarGraphProps from "../../types/BarGraphProps";

const HospitalizedTab: FC = () => {
  const [municipioFiltro, setMunicipioFiltro] = useState("");
  const [hospitalizations, setHospitalizations] = useState<BarGraphProps[]>([]);
  const [graphTitle, setGraphTitle] = useState("Pesquise uma cidade");

  function handleOnSubmit(filteredDb: DatabaseJSONProps[]) {
    setGraphTitle(
      `Número de internados por ano da cidade de ${municipioFiltro}`
    );
    const yearsHospitalizations = getYearsHospitalizations(filteredDb);
    const years = Object.keys(yearsHospitalizations);
    const ammounts: Array<number> = Object.values(yearsHospitalizations);

    const hospitalizationsObj = years.map((year, id) => {
      return {
        selector: year,
        info: ammounts[id],
      };
    });

    setHospitalizations(hospitalizationsObj);
  }

  function getYearsHospitalizations(array: DatabaseJSONProps[]) {
    const result = Object();

    array.forEach(function (item, id) {
      const date = new Date(item.dataIntern).getFullYear();

      if (!result[date]) {
        result[date] = 1;
      } else {
        result[date]++;
      }
    });

    return result;
  }

  function onChangeInput(e: ChangeEvent<HTMLInputElement>) {
    setMunicipioFiltro(e.target.value);
  }

  return (
    <Box>
      <CityFilter
        cityFilter={municipioFiltro}
        handleOnChange={onChangeInput}
        handleOnSubmit={handleOnSubmit}
      />

      <Paper>
        <Chart data={hospitalizations}>
          <ArgumentAxis />
          <ValueAxis />

          <BarSeries valueField="info" argumentField="selector" />
          <Title text={graphTitle} />
          <Animation />
          <EventTracker />
          <Tooltip />
        </Chart>
      </Paper>
    </Box>
  );
};

export default HospitalizedTab;
