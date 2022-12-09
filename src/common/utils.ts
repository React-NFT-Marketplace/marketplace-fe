import moment from 'moment';
import { ChainConfigs } from '../components/EVM';
import axios from 'axios';

export function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}

/**
 * Returns the number with 'en' locale settings, ie 1,000
 * @param x number
 * @param minDecimal number
 * @param maxDecimal number
 */
 export function toLocaleDecimal(x: number, minDecimal: number, maxDecimal: number) {
    return x.toLocaleString('en', {
        minimumFractionDigits: minDecimal,
        maximumFractionDigits: maxDecimal,
    });
}

/**
 * Runs the function if it's a function, returns the result or undefined
 * @param fn
 * @param args
 */
export const runIfFunction = (fn: any, ...args: any): any | undefined => {
    if(typeof(fn) == 'function'){
        return fn(...args);
    }

    return undefined;
}

/**
 * Returns the ellipsized version of string
 * @param x string
 * @param leftCharLength number
 * @param rightCharLength number
 */
export function ellipsizeThis(x: string, leftCharLength: number, rightCharLength: number) {
    if(!x) {
        return x;
    }

    let totalLength = leftCharLength + rightCharLength;

    if(totalLength >= x.length) {
        return x;
    }

    return x.substring(0, leftCharLength) + "..." + x.substring(x.length - rightCharLength, x.length);
}

/**
 * Returns the new object that has no reference to the old object to avoid mutations.
 * @param obj
 */
export const cloneObj = <T = any>(obj: {[key: string]: any}) => {
    return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * @returns string
 */
export const getRandomColor = () => {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getRandomNumber = (min: number, max: number, isInteger = false) => {
    let rand = min + (Math.random() * (max - min));
    if(isInteger) {
        rand = Math.round(rand);
    }

    else {
        // to 3 decimals
        rand = Math.floor(rand * 1000) / 1000;
    }

    return rand;
}

export const getRandomChance = () => {
    return getRandomNumber(0, 100);
}

export const getRandomNumberAsString = (min: number, max: number, isInteger = false) => {
    return getRandomNumber(min, max, isInteger).toString();
}

export const getRandomChanceAsString = () => {
    return getRandomNumberAsString(0, 100);
}

export const getUTCMoment = () => {
    return moment().utc();
}

export const getUTCDatetime = () => {
    return getUTCMoment().format('YYYY-MM-DD HH:mm:ss');
}

export const getUTCDate = () => {
    return getUTCMoment().format('YYYY-MM-DD');
}

export const getBaseUrl = () => {
    return process.env.REACT_APP_BASE_URL!;
}

export const getWsUrl = () => {
    return process.env.REACT_APP_WS_URL!;
}

export const truncateStr = (fullStr: string, strLen: number, separator='..') => {
    if (fullStr.length <= strLen) return fullStr;

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);

    return fullStr.substr(0, frontChars) +
           separator +
           fullStr.substr(fullStr.length - backChars);
}

export const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
}

export const ucFirst = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getBase64 = async (file: Blob) => {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const uppercase = (text: string) => {
    return text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

export const getChainIcon = (chainId: number) => {
    let image = "";

    switch(chainId) {
        case ChainConfigs.AVAXTEST.id:
            image = "avalanche";
            break;
        case ChainConfigs.BSCTEST.id:
            image = "bsc";
            break;
        case ChainConfigs.MUMBAI.id:
            image = "polygon";
            break;
        case ChainConfigs.FANTOMTEST.id:
            image = "fantom";
            break;
        case ChainConfigs.MOONBASE.id:
            image = "moonbeam";
            break;
    }

    return `/images/chains/${image}.png`;
}

// str byteToHex(uint8 byte)
//   converts a single byte to a hex string
function byteToHex(byte: any) {
    return ('0' + byte.toString(16)).slice(-2);
}


// str generateId(int len);
//   len - must be an even number (default: 40)
export function generateId(len = 40) {
    var arr = new Uint8Array(len / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, byteToHex).join("");
}

export const uploadToIPFS = async (ipfsPath: string, content: any): Promise<string> => {
    const options = {
        method: 'POST',
        url: 'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY
        },
        data: JSON.stringify([{
            path: ipfsPath,
            content: content
        }])
    };
    // image[0].name,
    // await getBase64(image[0]),

    return new Promise((resolve, reject) => {
        axios
            .request(options)
            .then((response) => {
                resolve(response.data[0].path);
            })
            .catch(function (error) {
                console.error(error);
                reject(`IPFS failed`);
            });
    })
}

export const getAxelarTxsHistory = async() => {
    const data = `{"senderAddress":${window.ethereum?.selectedAddress},"size":25,"from":0,"method":"searchGMP"}`;

    const config = {
        method: 'post',
        url: 'https://testnet.api.gmp.axelarscan.io/',
        headers: {
            'authority': 'testnet.api.gmp.axelarscan.io',
            'accept': '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh-TW;q=0.6,zh;q=0.5',
            'cache-control': 'no-cache',
            'content-type': 'text/plain;charset=UTF-8',
            'origin': 'https://testnet.axelarscan.io',
            'pragma': 'no-cache',
            'referer': 'https://testnet.axelarscan.io/',
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        data : data
    };

    return new Promise((resolve, reject) => {
        axios(config)
        .then(function (response) {
            resolve(response.data)
            // console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            // console.log(error);
            reject(error)
        });
    })

}