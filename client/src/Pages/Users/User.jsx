import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser } from "../../redux/action/user";
import { PiCalendar, PiNotepad, PiSealCheck, PiSealQuestion, PiXLight } from "react-icons/pi";
import { Divider, Dialog, DialogContent, DialogTitle, Slide } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const User = ({ open, setOpen }) => {
  ///////////////////////////////////// VARIABLES ////////////////////////////////////
  const dispatch = useDispatch();
  //   const { userId } = useParams();

  ///////////////////////////////////// STATES //////////////////////////////////////
  //   const { currentUser: user } = useSelector((state) => state.user);

  ///////////////////////////////////// USE EFFECT ////////////////////////////////////
  //   useEffect(() => {
  // dispatch(getUser(userId));
  //   }, [userId]);

  ///////////////////////////////////// FUNCTION //////////////////////////////////////

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className="flex items-center justify-end">
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="md:flex text-[#67757c] font-primary">
            <div className="bg-white w-full h-full px-4">
              <div className="text-2xl flex justify-center">Client Details</div>

              <div className="flex items-center pt-6 pb-2 gap-3 text-[20px]">
                {/* {user?.firstName + ' ' + user?.lastName} */}
              </div>
              <div className="pt-2 text-lg font-[350]"></div>

              <div className="flex items-center pt-6 pb-2 gap-3 text-[20px]">
                <PiNotepad className="text-[25px]" />
                Description
              </div>
              <Divider />
              <div className="pt-2 text-lg font-[350]"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
   
  );
};

export default User;
