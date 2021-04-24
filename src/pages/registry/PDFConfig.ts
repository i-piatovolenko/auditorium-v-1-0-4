import {TDocumentDefinitions} from "pdfmake/interfaces";
import {RegisterUnit} from "../../models/models";

export const getDocumentDefinition = (registerDate: Date, registerData: any): TDocumentDefinitions => ({
  pageSize: "A4",
  pageOrientation: "portrait",
  content: [
    {
      table: {
        widths: [30, "*", 50, 50],
        headerRows: 1,
        dontBreakRows: true,
        body: [
          [
            {
              text: `Журнал відвідувань за ${[
                registerDate.getDate(),
                registerDate.getMonth() + 1,
                registerDate.getFullYear(),
              ].join(".")}`,
              style: "header",
              colSpan: 4,
              alignment: "center",
              margin: [0, 10, 0, 10],
            },
            {},
            {},
            {},
          ],
          [
            { text: "Ауд.", style: "tableHeader", alignment: "center" },
            { text: "П.І.Б.", style: "tableHeader" },
            { text: "Від", style: "tableHeader", alignment: "center" },
            { text: "До", style: "tableHeader", alignment: "center" },
          ],
          ...registerData,
          [
            {
              text: "П.І.Б. ___________________ Підпис ____________________",
              alignment: "center",
              margin: [0, 10, 0, 10],
              colSpan: 4,
            },
            {},
            {},
            {},
          ],
        ],
      },
    },
  ],
  styles: {
    tableHeader: {
      bold: true,
    },
    header: {
      fontSize: 18,
      bold: true,
    },
    subheader: {
      fontSize: 15,
      bold: true,
    },
    quote: {
      italics: true,
    },
    small: {
      fontSize: 8,
    },
  },
});

export const getFormattedData = (data: any) => {
  return data.register.map((unit: RegisterUnit) => {
    const start =
      new Date(unit.start).getHours() +
      ":" +
      new Date(unit.start).getMinutes();
    const end =
      unit.end !== null
        ? new Date(unit.end).getHours() +
        ":" +
        new Date(unit.end).getMinutes()
        : "—";

    return [
      { text: unit.classroom.name, alignment: "center" },
      {
        text:
          unit.nameTemp === null
            ? [
              unit.user.lastName,
              unit.user.firstName,
              unit.user.patronymic,
            ].join(" ")
            : unit.nameTemp,
      },
      { text: start, alignment: "center" },
      { text: end, alignment: "center" },
    ];
  })
};