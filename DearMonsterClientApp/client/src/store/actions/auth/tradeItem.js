import { TRADE_ITEMS } from '../../types';
import { notification } from "../../../utils/notification";

export const getTradeItems = () => ({
    type: TRADE_ITEMS,
});


export const getTradeItemsAction = () => {
    return (dispatch) => {
        dispatch(getTradeItems());
        if (window.ethereum) {
            window.ethereum.enable().then(() => {
                window.ethereum.autoRefreshOnNetworkChange = false;
                window.ethereum.request({ method: 'eth_accounts' }).then((res) => {
                    if (res[0]) {
                        let notify = notification({
                            type: 'success',
                            message: 'MetaMask connected successfully',
                        });
                        notify();
                        setTimeout(() => {
                            // window.location.reload();
                        }, 500);
                    } else {
                        dispatch(connectUserError('connection not successful'));
                    }
                });
            });
        } else {
            let notify = notification({
                type: 'error',
                message: 'Please install MetaMask to continue',
            });
            notify();
            console.log('');
        }
    };
};
