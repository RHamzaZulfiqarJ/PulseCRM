import { useEffect } from "react";
import LedgerTopbar from "./LedgerTopbar";
import { Table } from "../../../Components";
import { format } from "timeago.js";
import LedgerSalesTopbar from "./LedgerSalesTopbar";
import { Tooltip } from "@mui/material";
import { PiDownloadSimpleLight, PiTrashLight } from "react-icons/pi";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLeadSales } from "../../../redux/action/sale";
import { getLeadCashbooks } from "../../../redux/action/cashbook";
import { getLead } from "../../../redux/action/lead";
import moment from "moment";

const Ledger = () => {
  /////////////////////////////////////////// VARIABLES ////////////////////////////////////////////
  const location = useLocation();
  const dispatch = useDispatch();
  const { leadId } = useParams();
  const { currentLead: lead } = useSelector((state) => state.lead);
  const {
    sales,
    isFetching: salesFetching,
    error: salesError,
  } = useSelector((state) => state.sale);
  const {
    cashbooks,
    isFetching: cashbookFetching,
    error: cashbookError,
  } = useSelector((state) => state.cashbook);

  const SalesColumns = [
    {
      field: "uid",
      headerName: "ID",
      width: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip title={""}>
          <span className="font-primary capitalize">{params.row?.uid}</span>
        </Tooltip>
      ),
    },
    {
      field: "staff",
      headerClassName: "super-app-theme--header",
      headerName: "Staff",
      width: 120,
      renderCell: (params) => (
        <div className="font-primary capitalize">{params.row?.staff}</div>
      ),
    },
    {
      field: "clientName",
      headerClassName: "super-app-theme--header",
      headerName: "Client Name",
      width: 130,
      renderCell: (params) => <div className="font-primary">{params.row?.clientName}</div>,
    },
    {
      field: "project",
      headerClassName: "super-app-theme--header",
      headerName: "Project",
      width: 150,
      renderCell: (params) => <div className="font-primary">{params.row?.project?.title}</div>,
    },
    {
      field: "totalAmount",
      headerClassName: "super-app-theme--header",
      headerName: "Total",
      width: 110,
      renderCell: (params) => <div className="font-primary">Rs. {params.row?.totalAmount}</div>,
    },
    {
      field: "buyingPrice",
      headerClassName: "super-app-theme--header",
      headerName: "Buying Price",
      width: 150,
      renderCell: (params) => <div className="font-primary">Rs. {params.row?.buyingPrice}</div>,
    },
    {
      field: "receivedAmount",
      headerClassName: "super-app-theme--header",
      headerName: "Received",
      width: 110,
      renderCell: (params) => <div className="font-primary">Rs. {params.row?.receivedAmount}</div>,
    },
    {
      field: "profit",
      headerClassName: "super-app-theme--header",
      headerName: "Profit",
      width: 110,
      renderCell: (params) => <div className="font-primary">Rs. {params.row?.profit}</div>,
    },
    {
      field: "createdAt",
      headerClassName: "super-app-theme--header",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => (
        <div className="font-primary">{moment(params.row?.createdAt).format("DD-MM-YYYY")}</div>
      ),
    },
  ];

  const LedgerColumns = [
    {
      field: "uid",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 70,
      renderCell: (params) => {
        <div className="font-primary">{params.row.uid}</div>;
      },
    },
    {
      field: "staff",
      headerName: "Staff",
      headerClassName: "super-app-theme--header",
      width: 120,
      renderCell: (params) => {
        <div className="font-primary capitalize">{params.row.staff}</div>;
      },
    },
    {
      field: "clientName",
      headerName: "Customer Name",
      headerClassName: "super-app-theme--header",
      width: 170,
      renderCell: (params) => {
        <div className="font-primary">{params.row.clientName}</div>;
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerClassName: "super-app-theme--header",
      width: 300,
      renderCell: (params) => {
        <div className="font-primary">{params.row.remarks}</div>;
      },
    },
    {
      field: "top",
      headerName: "Type of Payment",
      headerClassName: "super-app-theme--header",
      width: 170,
      renderCell: (params) => {
        <div style={{ fontFamily: "'Montserrat', sans-serif", textTransform: "capitalize" }}>{params.row.top}</div>;
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      headerClassName: "super-app-theme--header",
      width: 140,
      renderCell: (params) => {
        <div style={{ fontFamily: "'Montserrat', sans-serif", textTransform: "capitalize" }}>{params.row.amount}</div>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "super-app-theme--header",
      width: 150,
      renderCell: (params) => {
        <div className="font-primary">{params.row.type}</div>;
      },
    },
  ];
  /////////////////////////////////////////// STATES ////////////////////////////////////////////

  /////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////
  useEffect(() => {
    lead?._id && dispatch(getLeadSales(lead?._id));
    lead?._id && dispatch(getLeadCashbooks(lead?._id));
  }, [lead]);
  useEffect(() => {
    dispatch(getLead(leadId));
  }, [leadId]);

  /////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////

  return (
    <div className="w-full font-primary">
      <LedgerTopbar />
      <Table
        rows={cashbooks}
        isFetching={cashbookFetching}
        columns={LedgerColumns}
        rowsPerPage={10}
      />

      <LedgerSalesTopbar />
      <Table rows={sales} isFetching={salesFetching} columns={SalesColumns} rowsPerPage={10} />
    </div>
  );
};

export default Ledger;
