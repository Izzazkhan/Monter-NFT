import { TRADE_ITEMS } from '../../types';
import { notification } from "../../../utils/notification";
import axios from 'axios'
import { baseUrl } from "../../../config/config"

export const getTradeItems = () => ({
    type: TRADE_ITEMS,
});


export const getTradeItemsAction = () => {

    axios({
        method: 'get',
        url: `${baseUrl}api/tradeItem`,
        responseType: 'stream'
    })
        .then(function (response) {
            return (dispatch) => {
                dispatch(getTradeItems());
            }

        });


};
