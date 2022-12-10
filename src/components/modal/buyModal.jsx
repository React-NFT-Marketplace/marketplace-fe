import Link from "next/link";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { buyModalHide } from "../../../redux/counterSlice";
import { toLocaleDecimal } from "../../common/utils";
import ContractCall from "../EVM/ContractCall";
import { toast } from 'react-toastify';
import { BigNumber } from "ethers";

const SuccessMintToast = (url) => (
    <div>
        <a target="_blank" rel="noopener noreferrer" href={url}>Tx Success!</a>
    </div>
);

const BuyModal = () => {
  const { buyModal, buyModalProps } = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const onBuyClick = useCallback(async() => {
    let { chainId, itemId, price } = buyModalProps;

    if(!chainId) {
      alert('Unable to get chain');
      return;
    }

    try {
      dispatch(buyModalHide());
      let contract = new ContractCall(chainId);
      let url = await contract.buy(chainId, toLocaleDecimal(buyModalProps.price * 0.05, 3, 3), BigNumber.from(itemId));
      toast.success(SuccessMintToast(url));
    }

    catch (e){
      console.log(e);
      toast.error('Failed to buy!');
    }
  }, [buyModalProps, dispatch]);

  return (
    <div>
      {/* <!-- Buy Now Modal --> */}
      <div className={buyModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="buyNowModalLabel">
                Complete checkout
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(buyModalHide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>

            {/* <!-- Body --> */}
            <div className="modal-body p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
                  Item
                </span>
                <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
                  Subtotal
                </span>
              </div>

              <div className="dark:border-jacarta-600 border-jacarta-100 relative flex items-center border-t border-b py-4">
                <figure className="mr-10 self-start">
                  <img
                    src={buyModalProps.image}
                    alt="item_image"
                    className="rounded-2lg h-[200px]"
                    loading="lazy"
                  />
                </figure>

                <div className="mr-10">
                  <div className="text-accent text-sm">
                    {buyModalProps.name}
                  </div>
                  <h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">
                    {buyModalProps.collectionName}
                  </h3>
                  <div className="flex flex-wrap items-center">
                    <span className="dark:text-jacarta-300 text-jacarta-500 mr-1 block text-sm">
                      Royalty: 5%
                    </span>
                    <span data-tippy-content="A 5% royalty is charged.">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="dark:fill-jacarta-300 fill-jacarta-700 h-4 w-4"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="ml-auto">
                  <span className="mb-1 flex items-center whitespace-nowrap">
                    <span data-tippy-content="USDC">
                      <svg className="h-4 w-4">
                        <use xlinkHref="/icons.svg#icon-usdc"></use>
                      </svg>
                    </span>
                    <span className="dark:text-jacarta-100 text-sm font-medium tracking-tight ml-2">
                      {toLocaleDecimal(buyModalProps.price, 3, 3)}
                    </span>
                  </span>
                  <span className="mb-1 flex items-center justify-between whitespace-nowrap">
                    <span data-tippy-content="USDC">
                      <svg className="h-4 w-4">
                        <use xlinkHref="/icons.svg#icon-usdc"></use>
                      </svg>
                    </span>
                    <span className="dark:text-jacarta-100 text-sm font-medium tracking-tight ml-2">
                      {toLocaleDecimal(buyModalProps.price * 0.05, 3, 3)}
                    </span>
                  </span>
                </div>
              </div>

              {/* <!-- Total --> */}
              <div className="dark:border-jacarta-600 border-jacarta-100 mb-2 flex items-center justify-between border-b py-2.5">
                <span className="font-display text-jacarta-700 hover:text-accent font-semibold dark:text-white">
                  Total
                </span>
                <div className="ml-auto">
                  <span className="flex items-center whitespace-nowrap">
                    <span data-tippy-content="USDC">
                      <svg className="h-4 w-4">
                        <use xlinkHref="/icons.svg#icon-usdc"></use>
                      </svg>
                    </span>
                    <span className="text-green font-medium tracking-tight ml-2">
                      {toLocaleDecimal(buyModalProps.price * 1.05, 3, 3)}
                    </span>
                  </span>
                </div>
              </div>

              {/* <!-- Terms --> */}
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="buyNowTerms"
                  className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                />
                <label
                  htmlFor="buyNowTerms"
                  className="dark:text-jacarta-200 text-sm"
                >
                  By checking this box, I agree to {"MotM's"}{" "}
                  <Link href="/tarms">
                    <a className="text-accent">Terms of Service</a>
                  </Link>
                </label>
              </div>
            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                  onClick={onBuyClick}
                >
                  Confirm Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
