import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { delistModalHide } from "../../../redux/counterSlice";
import ContractCall from "../EVM/ContractCall";
import { toast } from 'react-toastify';

const SuccessMintToast = (url) => (
    <div>
        <a target="_blank" rel="noopener noreferrer" href={url}>Tx Success!</a> 
    </div>
);

const DelistModal = () => {
  const { delistModal, delistModalProps } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const onDelistClick = useCallback(async() => {
    let { chainId, itemId } = delistModalProps;

    if(!chainId) {
      alert('Unable to get chain');
      return;
    }

    try {
      dispatch(delistModalHide());
      let contract = new ContractCall(chainId);
      let url = await contract.delist(chainId, itemId);
      toast.success(SuccessMintToast(url));
    }

    catch (e){
      console.log(e);
      toast.error('Failed to delist!');
    }
  }, [delistModalProps, dispatch]);

  return (
    <div>
      <div className={delistModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog w-[500px] max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                Confirm Delist
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(delistModalHide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                  onClick={onDelistClick}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelistModal;
