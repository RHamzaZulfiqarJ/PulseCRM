import React, { useEffect, useState } from "react";
import { Table } from "../../Components";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../../redux/action/sale";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { PiTrashLight } from "react-icons/pi";
import { IoOpenOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import FilterDrawer from "./Filter";
import { getSaleReducer, getSalesReducer } from "../../redux/reducer/sale";
import moment from "moment";

function Sales() {
  ////////////////////////////////////// VARIABLES //////////////////////////////
  const dispatch = useDispatch();
  const { sales, allSales, isFetching, error } = useSelector((state) => state.sale);
  const columns = [
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
    {
      field: "action",
      headerName: "Action",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="flex gap-[10px] items-center transition-all">
          <div>
            <Tooltip placement="top" title="Delete">
              {" "}
              <PiTrashLight
                onClick={() => handleOpenDeleteModal(params.row._id)}
                className="cursor-pointer text-red-500 text-[23px] hover:text-red-400"
              />
            </Tooltip>
          </div>
          <Tooltip placement="top" title="Edit">
            {" "}
            <CiEdit
              onClick={() => handleOpenEditModal(params.row)}
              className="cursor-pointer text-green-500 text-[23px] hover:text-green-600"
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  ////////////////////////////////////// STATES //////////////////////////////
  const [view, setView] = useState("table");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [openFilters, setOpenFilters] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  ////////////////////////////////////// USE EFFECTS //////////////////////////////
  useEffect(() => {
    dispatch(getSales());
  }, []);
  useEffect(() => {
    if (!isFiltered) {
      dispatch(getSalesReducer(allSales))
    }
  }, [isFiltered])

  ////////////////////////////////////// FUNCTION //////////////////////////////
  const handleOpenEditModal = (sale) => {
    setOpenEditModal(true);
    dispatch(getSaleReducer(sale));
  };
  const handleOpenDeleteModal = (saleId) => {
    setOpenDeleteModal(true);
    setSelectedSaleId(saleId);
  };

  return (
    <div className="w-full h-fit bg-inherit flex flex-col">
      <EditModal open={openEditModal} setOpen={setOpenEditModal} />
      <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} saleId={selectedSaleId} />
      <FilterDrawer open={openFilters} setOpen={setOpenFilters} setIsFiltered={setIsFiltered} />
      <Topbar view={view} setView={setView} open={openFilters} setOpen={setOpenFilters} isFiltered={isFiltered} setIsFiltered={setIsFiltered} />

      <Table rows={sales} columns={columns} rowsPerPage={10} isFetching={isFetching} error={error} />
    </div>
  );
}

export default Sales;
