import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentNav from '../PaymentNav/PaymentNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Payment.css';
import apiUrl from '../../config'

const Payment = () => {
    const location = useLocation();
    const { product } = location.state || {};

    const [seconds, setSeconds] = useState(270); // Initial timer value in seconds (4 minutes 30 seconds)
    const [selectedPayment, setSelectedPayment] = useState(null); // State to track selected payment option
    const [upiData, setUpiData] = useState(null); // State to store UPI data
    const [paymentOptions, setPaymentOptions] = useState({}); // State to store payment options

    // Fetch UPI data on component mount
    useEffect(() => {
        const fetchUpiData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/upi`);
                const data = await response.json();
                setUpiData(data[0]); // Assuming the response contains an array with one object
                setPaymentOptions(data[0].payment_options); // Set payment options directly from the response
            } catch (error) {
                console.error('Error fetching UPI data:', error);
            }
        };

        fetchUpiData();
    }, []);

    // Timer countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        // Clear interval on component unmount or if seconds reach 0
        return () => clearInterval(timer);
    }, [seconds]);

    // Function to handle payment option selection
    const handlePaymentSelection = (paymentType) => {
        setSelectedPayment(paymentType);
    };

    // Function to handle payment and open the corresponding app
    const handlePayment = () => {
    if (!upiData) {
        console.log('UPI data not available');
        return;
    }

    const siteName = 'Online Shopping';
    const { upi_id, upi_name } = upiData;
    const amount = parseFloat(product.sellingPrice).toFixed(2);
    const transactionId = 'H2MkMGf5olejI'; // Replace with actual transaction ID
    const merchantCode = '8931'; // Replace with actual merchant code
    const currency = 'INR';
    const note = siteName;
    const signature = 'AAuN7izDWN5cb8A5scnUiNME+LkZqI2DWgkXlN1McoP6WZABa/KkFTiLvuPRP6/nWK8BPg/rPhb+u4QMrUEX10UsANTDbJaALcSM9b8Wk218X+55T/zOzb7xoiB+BcX8yYuYayELImXJHIgL/c7nkAnHrwUCmbM97nRbCVVRvU0ku3Tr'; // Replace with actual signature

    let paymentLink = '';

    switch (selectedPayment) {
        case 'phonepe':
            paymentLink = `phonepe://pay?pa=${upi_id}&pn=${upi_name}&am=${amount}&cu=${currency}&tr=${transactionId}&mc=${merchantCode}&tn=${note}&sign=${signature}`;
            break;
        case 'bhim_upi':
            paymentLink = `upi://pay?pa=${upi_id}&pn=${upi_name}&am=${amount}&cu=${currency}&tr=${transactionId}&mc=${merchantCode}&tn=${note}&sign=${signature}`;
            break;
        case 'google_pay':
            paymentLink = `tez://upi/pay?pa=${upi_id}&pn=${upi_name}&am=${amount}&cu=${currency}&tr=${transactionId}&mc=${merchantCode}&tn=${note}&sign=${signature}`;
            break;
        case 'upi':
           paymentLink = 'paytm://pay?amount=${amount}&transactionId=${transactionId}&currency=${currency}&note=${note}&signature=${signature}';           
            break;
        default:
            console.log('Select a payment method');
            break;
    }

    // Perform action based on payment method (open app or process payment)
    if (paymentLink !== '') {
        window.open(paymentLink, '_self'); // Open payment app in the same tab
    } else {
        console.log('Select a payment method');
    }
};


    if (!product) {
        return <div></div>;
    }

    return (
        <div>
            <PaymentNav title={"Payments"} />
            <div className="card pt-3">
               
                {/* Timer Section */}
                <div className="card py-1 my-1">
                    <div className="py-2 px-3">
                        <div className="container-fluid px-0 offerend-container">
                            <h4> Offer ends in <span className="offer-timer" id="offerend-time">
                                {Math.floor(seconds / 60)}min {seconds % 60}sec
                            </span></h4>
                        </div>
                        {paymentOptions.divphonepe && (
                            <div id="divphonepe" className={`form-check available-method my-2 ${selectedPayment === 'phonepe' ? 'active' : ''}`}
                                onClick={() => handlePaymentSelection('phonepe')}>
                                <label className="form-check-label">
                                    {/* PhonePe icon and text */}
                                    <svg height="30" viewBox="0 0 700 700" width="30" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="339.53" cy="339.53" fill="#5f259f" r="339.46"></circle>
                                        <path d="m493.6 250.94c0-13.27-11.38-24.65-24.65-24.65h-45.51l-104.3-119.47c-9.48-11.38-24.65-15.17-39.82-11.38l-36.03 11.38c-5.69 1.9-7.59 9.48-3.79 13.27l113.78 108.1h-172.59c-5.69 0-9.48 3.79-9.48 9.48v18.96c0 13.27 11.38 24.65 24.65 24.65h26.55v91.03c0 68.27 36.03 108.1 96.72 108.1 18.96 0 34.14-1.9 53.1-9.48v60.69c0 17.07 13.27 30.34 30.34 30.34h26.55c5.69 0 11.38-5.69 11.38-11.38v-271.19h43.62c5.69 0 9.48-3.79 9.48-9.48zm-121.37 163.09c-11.38 5.69-26.55 7.59-37.93 7.59-30.34 0-45.51-15.17-45.51-49.31v-91.03h83.44z" fill="#fff"></path>
                                    </svg>
                                    <span className="unaviablee">PhonePe</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divbhimupi && (
                            <div id="divbhimupi" className={`form-check available-method my-2 ${selectedPayment === 'bhim_upi' ? 'active' : ''}`}
                                onClick={() => handlePaymentSelection('bhim_upi')}>
                                <label className="form-check-label">
                                    {/* BHIM UPI icon and text */}
                                    <img src="/assets/payments/bhim.webp" className="pay-logo" alt="button" />
                                    <span className="unaviablee mx-4">BHIM UPI</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divgooglepay && (
                            <div id="divgooglepay" className={`form-check available-method my-2 ${selectedPayment === 'google_pay' ? 'active' : ''}`}
                                onClick={() => handlePaymentSelection('google_pay')}>
                                <label className="form-check-label">
                                    {/* Google Pay icon and text */}
                                    <img src="/assets/payments/googlepay.png" className="pay-logo" alt="button" />
                                    <span className="unaviablee mx-4">Google Pay</span>
                                </label>
                            </div>
                        )}
                        {paymentOptions.divupi && (
                            <div id="divupi" className={`form-check available-method my-2 ${selectedPayment === 'upi' ? 'active' : ''}`}
                                onClick={() => handlePaymentSelection('upi')}>
                                <label className="form-check-label">
                                    {/* UPI icon and text */}
                                    <img src="/assets/payments/qr.png" className="pay-logo" alt="button" />
                                    <span className="unaviablee mx-4">QR</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Details Section */}
                <div className="card px-3 py-4 mb-8" id="price-detail">
                    <h3>Price Details</h3>
                    <div className="price-detail-div mt-2">
                        <div className="product-price-list my-3">
                            <span className="title">Price (1 item)</span>
                            <span className="data selling_price me-0 td-none">₹ {product.sellingPrice}</span>
                        </div>
                        <div className="product-price-list my-3">
                            <span className="title">Delivery Charges</span>
                            <span className="data text-success">FREE </span>
                        </div>
                        <div className="product-price-list mt-3 pt-3 total">
                            <span className="title">Amount Payable</span>
                            <span className="data selling_price">₹ {product.sellingPrice}</span>
                        </div>
                    </div>
                </div>
                <div style={{display:"flex",justifyContent:'center',alignItems:'center'}}>
                    <img src='assets/payments/easy.png' alt='payment' style={{width:'90%',marginBottom:'80px',objectFit:'contain'}} />
                </div>
                
                {/* Button Section */}
                <div className="button-container flex p-3 bg-white">
                    <div className="col-6 footer-price">
                        <span className="strike mrp ms-0 mb-1" id="mrp">₹ {product.mrp}</span>
                        <span className="selling_price" id="selling_price">₹ {product.sellingPrice}</span>
                    </div>
                    <button onClick={handlePayment} className="buynow-button product-page-buy col-6 btn-continue text-center">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;



 <div className="progress-box mb-0"><svg width="360" height="56" viewBox="0 0 360 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}><path fillRule="evenodd" clipRule="evenodd" d="M360 0H0V56H360V0Z" fill="white"></path><path d="M300 27.5C305.247 27.5 309.5 23.2467 309.5 18C309.5 12.7533 305.247 8.5 300 8.5C294.753 8.5 290.5 12.7533 290.5 18C290.5 23.2467 294.753 27.5 300 27.5Z" fill="#2874F0" stroke="#2874F0"></path><path d="M298.785 17.084H299.652C300.09 17.0801 300.436 16.9668 300.689 16.7441C300.947 16.5215 301.076 16.1992 301.076 15.7773C301.076 15.3711 300.969 15.0566 300.754 14.834C300.543 14.6074 300.219 14.4941 299.781 14.4941C299.398 14.4941 299.084 14.6055 298.838 14.8281C298.592 15.0469 298.469 15.334 298.469 15.6895H297.045C297.045 15.252 297.16 14.8535 297.391 14.4941C297.625 14.1348 297.949 13.8555 298.363 13.6562C298.781 13.4531 299.248 13.3516 299.764 13.3516C300.615 13.3516 301.283 13.5664 301.768 13.9961C302.256 14.4219 302.5 15.0156 302.5 15.7773C302.5 16.1602 302.377 16.5215 302.131 16.8613C301.889 17.1973 301.574 17.4512 301.188 17.623C301.656 17.7832 302.012 18.0352 302.254 18.3789C302.5 18.7227 302.623 19.1328 302.623 19.6094C302.623 20.375 302.359 20.9844 301.832 21.4375C301.309 21.8906 300.619 22.1172 299.764 22.1172C298.943 22.1172 298.271 21.8984 297.748 21.4609C297.225 21.0234 296.963 20.4414 296.963 19.7148H298.387C298.387 20.0898 298.512 20.3945 298.762 20.6289C299.016 20.8633 299.355 20.9805 299.781 20.9805C300.223 20.9805 300.57 20.8633 300.824 20.6289C301.078 20.3945 301.205 20.0547 301.205 19.6094C301.205 19.1602 301.072 18.8145 300.807 18.5723C300.541 18.3301 300.146 18.209 299.623 18.209H298.785V17.084Z" fill="white"></path><path d="M60 27.5C65.2467 27.5 69.5 23.2467 69.5 18C69.5 12.7533 65.2467 8.5 60 8.5C54.7533 8.5 50.5 12.7533 50.5 18C50.5 23.2467 54.7533 27.5 60 27.5Z" fill="#F4F8FF" stroke="#2874F0"></path><path fillRule="evenodd" clipRule="evenodd" d="M56.13 18.484C56.0382 18.3886 55.9869 18.2614 55.9869 18.129C55.9869 17.9966 56.0382 17.8694 56.13 17.774L56.289 17.612C56.479 17.416 56.789 17.416 56.981 17.612L58.449 19.116C58.641 19.312 58.949 19.316 59.139 19.119L63.024 15.129C63.214 14.935 63.524 14.938 63.713 15.134L63.871 15.298C63.9632 15.3962 64.0136 15.5263 64.0117 15.661C64.0099 15.7957 63.9558 15.9244 63.861 16.02L59.151 20.857C59.1058 20.9039 59.0518 20.9413 58.9921 20.9672C58.9324 20.9931 58.8682 21.0069 58.8031 21.0078C58.738 21.0087 58.6734 20.9968 58.613 20.9726C58.5525 20.9484 58.4975 20.9125 58.451 20.867L56.131 18.484H56.13Z" fill="#2874F0"></path><path d="M180 27.5C185.247 27.5 189.5 23.2467 189.5 18C189.5 12.7533 185.247 8.5 180 8.5C174.753 8.5 170.5 12.7533 170.5 18C170.5 23.2467 174.753 27.5 180 27.5Z" fill="#F4F8FF" stroke="#2874F0"></path><path fillRule="evenodd" clipRule="evenodd" d="M176.13 18.484C176.038 18.3886 175.987 18.2614 175.987 18.129C175.987 17.9966 176.038 17.8694 176.13 17.774L176.289 17.612C176.479 17.416 176.789 17.416 176.981 17.612L178.449 19.116C178.641 19.312 178.949 19.316 179.139 19.119L183.024 15.129C183.214 14.935 183.524 14.938 183.713 15.134L183.871 15.298C183.963 15.3962 184.014 15.5263 184.012 15.661C184.01 15.7957 183.956 15.9244 183.861 16.02L179.151 20.857C179.106 20.9039 179.052 20.9413 178.992 20.9672C178.932 20.9931 178.868 21.0069 178.803 21.0078C178.738 21.0087 178.673 20.9968 178.613 20.9726C178.553 20.9484 178.497 20.9125 178.451 20.867L176.131 18.484H176.13Z" fill="#2874F0"></path><path d="M43.6792 40.7734H40.105L39.3022 43H38.1421L41.3999 34.4688H42.3843L45.6479 43H44.4937L43.6792 40.7734ZM40.4448 39.8477H43.3452L41.8921 35.8574L40.4448 39.8477ZM46.3628 39.7773C46.3628 38.8047 46.5933 38.0234 47.0542 37.4336C47.5151 36.8398 48.1187 36.543 48.8647 36.543C49.6069 36.543 50.1948 36.7969 50.6284 37.3047V34H51.7124V43H50.7163L50.6636 42.3203C50.23 42.8516 49.6265 43.1172 48.853 43.1172C48.1187 43.1172 47.519 42.8164 47.0542 42.2148C46.5933 41.6133 46.3628 40.8281 46.3628 39.8594V39.7773ZM47.4468 39.9004C47.4468 40.6191 47.5952 41.1816 47.8921 41.5879C48.189 41.9941 48.5991 42.1973 49.1226 42.1973C49.8101 42.1973 50.312 41.8887 50.6284 41.2715V38.3594C50.3042 37.7617 49.8062 37.4629 49.1343 37.4629C48.603 37.4629 48.189 37.668 47.8921 38.0781C47.5952 38.4883 47.4468 39.0957 47.4468 39.9004ZM53.1362 39.7773C53.1362 38.8047 53.3667 38.0234 53.8276 37.4336C54.2886 36.8398 54.8921 36.543 55.6382 36.543C56.3804 36.543 56.9683 36.7969 57.4019 37.3047V34H58.4858V43H57.4897L57.437 42.3203C57.0034 42.8516 56.3999 43.1172 55.6265 43.1172C54.8921 43.1172 54.2925 42.8164 53.8276 42.2148C53.3667 41.6133 53.1362 40.8281 53.1362 39.8594V39.7773ZM54.2202 39.9004C54.2202 40.6191 54.3687 41.1816 54.6655 41.5879C54.9624 41.9941 55.3726 42.1973 55.896 42.1973C56.5835 42.1973 57.0854 41.8887 57.4019 41.2715V38.3594C57.0776 37.7617 56.5796 37.4629 55.9077 37.4629C55.3765 37.4629 54.9624 37.668 54.6655 38.0781C54.3687 38.4883 54.2202 39.0957 54.2202 39.9004ZM63.2378 37.6328C63.0737 37.6055 62.896 37.5918 62.7046 37.5918C61.9937 37.5918 61.5112 37.8945 61.2573 38.5V43H60.1733V36.6602H61.228L61.2456 37.3926C61.6011 36.8262 62.105 36.543 62.7573 36.543C62.9683 36.543 63.1284 36.5703 63.2378 36.625V37.6328ZM66.7534 43.1172C65.894 43.1172 65.1948 42.8359 64.6558 42.2734C64.1167 41.707 63.8472 40.9512 63.8472 40.0059V39.8066C63.8472 39.1777 63.9663 38.6172 64.2046 38.125C64.4468 37.6289 64.7827 37.2422 65.2124 36.9648C65.646 36.6836 66.1147 36.543 66.6187 36.543C67.4429 36.543 68.0835 36.8145 68.5405 37.3574C68.9976 37.9004 69.2261 38.6777 69.2261 39.6895V40.1406H64.9312C64.9468 40.7656 65.1284 41.2715 65.4761 41.6582C65.8276 42.041 66.2729 42.2324 66.812 42.2324C67.1948 42.2324 67.519 42.1543 67.7847 41.998C68.0503 41.8418 68.2827 41.6348 68.4819 41.377L69.144 41.8926C68.6128 42.709 67.8159 43.1172 66.7534 43.1172ZM66.6187 37.4336C66.1812 37.4336 65.814 37.5938 65.5171 37.9141C65.2202 38.2305 65.0366 38.6758 64.9663 39.25H68.1421V39.168C68.1108 38.6172 67.9624 38.1914 67.6968 37.8906C67.4312 37.5859 67.0718 37.4336 66.6187 37.4336ZM74.1772 41.3184C74.1772 41.0254 74.0659 40.7988 73.8433 40.6387C73.6245 40.4746 73.2397 40.334 72.689 40.2168C72.1421 40.0996 71.7065 39.959 71.3823 39.7949C71.062 39.6309 70.8237 39.4355 70.6675 39.209C70.5151 38.9824 70.439 38.7129 70.439 38.4004C70.439 37.8809 70.6577 37.4414 71.0952 37.082C71.5366 36.7227 72.0991 36.543 72.7827 36.543C73.5015 36.543 74.0835 36.7285 74.5288 37.0996C74.978 37.4707 75.2026 37.9453 75.2026 38.5234H74.1128C74.1128 38.2266 73.9858 37.9707 73.7319 37.7559C73.4819 37.541 73.1655 37.4336 72.7827 37.4336C72.3882 37.4336 72.0796 37.5195 71.8569 37.6914C71.6343 37.8633 71.5229 38.0879 71.5229 38.3652C71.5229 38.627 71.6265 38.8242 71.8335 38.957C72.0405 39.0898 72.4136 39.2168 72.9526 39.3379C73.4956 39.459 73.9351 39.6035 74.271 39.7715C74.6069 39.9395 74.855 40.1426 75.0151 40.3809C75.1792 40.6152 75.2612 40.9023 75.2612 41.2422C75.2612 41.8086 75.0347 42.2637 74.5815 42.6074C74.1284 42.9473 73.5405 43.1172 72.8179 43.1172C72.3101 43.1172 71.8608 43.0273 71.4702 42.8477C71.0796 42.668 70.7729 42.418 70.5503 42.0977C70.3315 41.7734 70.2222 41.4238 70.2222 41.0488H71.3062C71.3257 41.4121 71.4702 41.7012 71.7397 41.916C72.0132 42.127 72.3726 42.2324 72.8179 42.2324C73.228 42.2324 73.5562 42.1504 73.8022 41.9863C74.0522 41.8184 74.1772 41.5957 74.1772 41.3184ZM80.3647 41.3184C80.3647 41.0254 80.2534 40.7988 80.0308 40.6387C79.812 40.4746 79.4272 40.334 78.8765 40.2168C78.3296 40.0996 77.894 39.959 77.5698 39.7949C77.2495 39.6309 77.0112 39.4355 76.855 39.209C76.7026 38.9824 76.6265 38.7129 76.6265 38.4004C76.6265 37.8809 76.8452 37.4414 77.2827 37.082C77.7241 36.7227 78.2866 36.543 78.9702 36.543C79.689 36.543 80.271 36.7285 80.7163 37.0996C81.1655 37.4707 81.3901 37.9453 81.3901 38.5234H80.3003C80.3003 38.2266 80.1733 37.9707 79.9194 37.7559C79.6694 37.541 79.353 37.4336 78.9702 37.4336C78.5757 37.4336 78.2671 37.5195 78.0444 37.6914C77.8218 37.8633 77.7104 38.0879 77.7104 38.3652C77.7104 38.627 77.814 38.8242 78.021 38.957C78.228 39.0898 78.6011 39.2168 79.1401 39.3379C79.6831 39.459 80.1226 39.6035 80.4585 39.7715C80.7944 39.9395 81.0425 40.1426 81.2026 40.3809C81.3667 40.6152 81.4487 40.9023 81.4487 41.2422C81.4487 41.8086 81.2222 42.2637 80.769 42.6074C80.3159 42.9473 79.728 43.1172 79.0054 43.1172C78.4976 43.1172 78.0483 43.0273 77.6577 42.8477C77.2671 42.668 76.9604 42.418 76.7378 42.0977C76.519 41.7734 76.4097 41.4238 76.4097 41.0488H77.4937C77.5132 41.4121 77.6577 41.7012 77.9272 41.916C78.2007 42.127 78.5601 42.2324 79.0054 42.2324C79.4155 42.2324 79.7437 42.1504 79.9897 41.9863C80.2397 41.8184 80.3647 41.5957 80.3647 41.3184Z" fill="#666666"></path><path d="M145.805 39.0098C145.805 39.8457 145.664 40.5762 145.383 41.2012C145.102 41.8223 144.703 42.2969 144.188 42.625C143.672 42.9531 143.07 43.1172 142.383 43.1172C141.711 43.1172 141.115 42.9531 140.596 42.625C140.076 42.293 139.672 41.8223 139.383 41.2129C139.098 40.5996 138.951 39.8906 138.943 39.0859V38.4707C138.943 37.6504 139.086 36.9258 139.371 36.2969C139.656 35.668 140.059 35.1875 140.578 34.8555C141.102 34.5195 141.699 34.3516 142.371 34.3516C143.055 34.3516 143.656 34.5176 144.176 34.8496C144.699 35.1777 145.102 35.6562 145.383 36.2852C145.664 36.9102 145.805 37.6387 145.805 38.4707V39.0098ZM144.686 38.459C144.686 37.4473 144.482 36.6719 144.076 36.1328C143.67 35.5898 143.102 35.3184 142.371 35.3184C141.66 35.3184 141.1 35.5898 140.69 36.1328C140.283 36.6719 140.074 37.4219 140.063 38.3828V39.0098C140.063 39.9902 140.268 40.7617 140.678 41.3242C141.092 41.8828 141.66 42.1621 142.383 42.1621C143.109 42.1621 143.672 41.8984 144.07 41.3711C144.469 40.8398 144.674 40.0801 144.686 39.0918V38.459ZM150.387 37.6328C150.223 37.6055 150.045 37.5918 149.854 37.5918C149.143 37.5918 148.66 37.8945 148.406 38.5V43H147.322V36.6602H148.377L148.395 37.3926C148.75 36.8262 149.254 36.543 149.906 36.543C150.117 36.543 150.277 36.5703 150.387 36.625V37.6328ZM151.008 39.7773C151.008 38.8047 151.238 38.0234 151.699 37.4336C152.16 36.8398 152.764 36.543 153.51 36.543C154.252 36.543 154.84 36.7969 155.273 37.3047V34H156.357V43H155.361L155.309 42.3203C154.875 42.8516 154.272 43.1172 153.498 43.1172C152.764 43.1172 152.164 42.8164 151.699 42.2148C151.238 41.6133 151.008 40.8281 151.008 39.8594V39.7773ZM152.092 39.9004C152.092 40.6191 152.24 41.1816 152.537 41.5879C152.834 41.9941 153.244 42.1973 153.768 42.1973C154.455 42.1973 154.957 41.8887 155.273 41.2715V38.3594C154.949 37.7617 154.451 37.4629 153.779 37.4629C153.248 37.4629 152.834 37.668 152.537 38.0781C152.24 38.4883 152.092 39.0957 152.092 39.9004ZM160.676 43.1172C159.816 43.1172 159.117 42.8359 158.578 42.2734C158.039 41.707 157.77 40.9512 157.77 40.0059V39.8066C157.77 39.1777 157.889 38.6172 158.127 38.125C158.369 37.6289 158.705 37.2422 159.135 36.9648C159.568 36.6836 160.037 36.543 160.541 36.543C161.365 36.543 162.006 36.8145 162.463 37.3574C162.92 37.9004 163.148 38.6777 163.148 39.6895V40.1406H158.854C158.869 40.7656 159.051 41.2715 159.398 41.6582C159.75 42.041 160.195 42.2324 160.734 42.2324C161.117 42.2324 161.441 42.1543 161.707 41.998C161.973 41.8418 162.205 41.6348 162.404 41.377L163.066 41.8926C162.535 42.709 161.738 43.1172 160.676 43.1172ZM160.541 37.4336C160.104 37.4336 159.736 37.5938 159.44 37.9141C159.143 38.2305 158.959 38.6758 158.889 39.25H162.065V39.168C162.033 38.6172 161.885 38.1914 161.619 37.8906C161.354 37.5859 160.994 37.4336 160.541 37.4336ZM167.473 37.6328C167.309 37.6055 167.131 37.5918 166.94 37.5918C166.229 37.5918 165.746 37.8945 165.492 38.5V43H164.408V36.6602H165.463L165.481 37.3926C165.836 36.8262 166.34 36.543 166.992 36.543C167.203 36.543 167.363 36.5703 167.473 36.625V37.6328ZM174.135 39.1973C173.17 38.9199 172.467 38.5801 172.025 38.1777C171.588 37.7715 171.369 37.2715 171.369 36.6777C171.369 36.0059 171.637 35.4512 172.172 35.0137C172.711 34.5723 173.41 34.3516 174.27 34.3516C174.856 34.3516 175.377 34.4648 175.834 34.6914C176.295 34.918 176.65 35.2305 176.9 35.6289C177.154 36.0273 177.281 36.4629 177.281 36.9355H176.15C176.15 36.4199 175.986 36.0156 175.658 35.7227C175.33 35.4258 174.867 35.2773 174.27 35.2773C173.715 35.2773 173.281 35.4004 172.969 35.6465C172.66 35.8887 172.506 36.2266 172.506 36.6602C172.506 37.0078 172.652 37.3027 172.945 37.5449C173.242 37.7832 173.744 38.002 174.451 38.2012C175.162 38.4004 175.717 38.6211 176.115 38.8633C176.518 39.1016 176.815 39.3809 177.006 39.7012C177.201 40.0215 177.299 40.3984 177.299 40.832C177.299 41.5234 177.029 42.0781 176.49 42.4961C175.951 42.9102 175.231 43.1172 174.328 43.1172C173.742 43.1172 173.195 43.0059 172.688 42.7832C172.18 42.5566 171.787 42.248 171.51 41.8574C171.236 41.4668 171.1 41.0234 171.1 40.5273H172.231C172.231 41.043 172.42 41.4512 172.799 41.752C173.182 42.0488 173.691 42.1973 174.328 42.1973C174.922 42.1973 175.377 42.0762 175.693 41.834C176.01 41.5918 176.168 41.2617 176.168 40.8438C176.168 40.4258 176.022 40.1035 175.729 39.877C175.436 39.6465 174.904 39.4199 174.135 39.1973ZM182.49 42.373C182.068 42.8691 181.449 43.1172 180.633 43.1172C179.957 43.1172 179.441 42.9219 179.086 42.5312C178.734 42.1367 178.557 41.5547 178.553 40.7852V36.6602H179.637V40.7559C179.637 41.7168 180.027 42.1973 180.809 42.1973C181.637 42.1973 182.188 41.8887 182.461 41.2715V36.6602H183.545V43H182.514L182.49 42.373ZM186.217 36.6602L186.246 37.3633C186.711 36.8164 187.338 36.543 188.127 36.543C189.014 36.543 189.617 36.8828 189.938 37.5625C190.148 37.2578 190.422 37.0117 190.758 36.8242C191.098 36.6367 191.498 36.543 191.959 36.543C193.35 36.543 194.057 37.2793 194.08 38.752V43H192.996V38.8164C192.996 38.3633 192.893 38.0254 192.686 37.8027C192.479 37.5762 192.131 37.4629 191.643 37.4629C191.24 37.4629 190.906 37.584 190.641 37.8262C190.375 38.0645 190.221 38.3867 190.178 38.793V43H189.088V38.8457C189.088 37.9238 188.637 37.4629 187.734 37.4629C187.023 37.4629 186.537 37.7656 186.275 38.3711V43H185.191V36.6602H186.217ZM196.74 36.6602L196.77 37.3633C197.234 36.8164 197.861 36.543 198.65 36.543C199.537 36.543 200.141 36.8828 200.461 37.5625C200.672 37.2578 200.945 37.0117 201.281 36.8242C201.621 36.6367 202.022 36.543 202.482 36.543C203.873 36.543 204.58 37.2793 204.604 38.752V43H203.52V38.8164C203.52 38.3633 203.416 38.0254 203.209 37.8027C203.002 37.5762 202.654 37.4629 202.166 37.4629C201.764 37.4629 201.43 37.584 201.164 37.8262C200.898 38.0645 200.744 38.3867 200.701 38.793V43H199.611V38.8457C199.611 37.9238 199.16 37.4629 198.258 37.4629C197.547 37.4629 197.061 37.7656 196.799 38.3711V43H195.715V36.6602H196.74ZM210.158 43C210.096 42.875 210.045 42.6523 210.006 42.332C209.502 42.8555 208.9 43.1172 208.201 43.1172C207.576 43.1172 207.063 42.9414 206.66 42.5898C206.262 42.2344 206.063 41.7852 206.063 41.2422C206.063 40.582 206.313 40.0703 206.813 39.707C207.316 39.3398 208.023 39.1562 208.934 39.1562H209.988V38.6582C209.988 38.2793 209.875 37.9785 209.648 37.7559C209.422 37.5293 209.088 37.416 208.647 37.416C208.26 37.416 207.936 37.5137 207.674 37.709C207.412 37.9043 207.281 38.1406 207.281 38.418H206.191C206.191 38.1016 206.303 37.7969 206.525 37.5039C206.752 37.207 207.057 36.9727 207.44 36.8008C207.826 36.6289 208.25 36.543 208.711 36.543C209.441 36.543 210.014 36.7266 210.428 37.0938C210.842 37.457 211.057 37.959 211.072 38.5996V41.5176C211.072 42.0996 211.147 42.5625 211.295 42.9062V43H210.158ZM208.359 42.1738C208.699 42.1738 209.022 42.0859 209.326 41.9102C209.631 41.7344 209.852 41.5059 209.988 41.2246V39.9238H209.139C207.811 39.9238 207.147 40.3125 207.147 41.0898C207.147 41.4297 207.26 41.6953 207.486 41.8867C207.713 42.0781 208.004 42.1738 208.359 42.1738ZM215.836 37.6328C215.672 37.6055 215.494 37.5918 215.303 37.5918C214.592 37.5918 214.109 37.8945 213.856 38.5V43H212.772V36.6602H213.826L213.844 37.3926C214.199 36.8262 214.703 36.543 215.356 36.543C215.566 36.543 215.727 36.5703 215.836 36.625V37.6328ZM219.018 41.4121L220.494 36.6602H221.654L219.106 43.9785C218.711 45.0332 218.084 45.5605 217.225 45.5605L217.02 45.543L216.615 45.4668V44.5879L216.908 44.6113C217.275 44.6113 217.561 44.5371 217.764 44.3887C217.971 44.2402 218.141 43.9688 218.273 43.5742L218.514 42.9297L216.252 36.6602H217.436L219.018 41.4121Z" fill="#666666"></path><path d="M278.417 39.6602V43H277.292V34.4688H280.439C281.372 34.4688 282.103 34.707 282.63 35.1836C283.161 35.6602 283.427 36.291 283.427 37.0762C283.427 37.9043 283.167 38.543 282.648 38.9922C282.132 39.4375 281.392 39.6602 280.427 39.6602H278.417ZM278.417 38.7402H280.439C281.04 38.7402 281.501 38.5996 281.822 38.3184C282.142 38.0332 282.302 37.623 282.302 37.0879C282.302 36.5801 282.142 36.1738 281.822 35.8691C281.501 35.5645 281.062 35.4062 280.503 35.3945H278.417V38.7402ZM288.536 43C288.474 42.875 288.423 42.6523 288.384 42.332C287.88 42.8555 287.279 43.1172 286.579 43.1172C285.954 43.1172 285.441 42.9414 285.038 42.5898C284.64 42.2344 284.441 41.7852 284.441 41.2422C284.441 40.582 284.691 40.0703 285.191 39.707C285.695 39.3398 286.402 39.1562 287.312 39.1562H288.366V38.6582C288.366 38.2793 288.253 37.9785 288.027 37.7559C287.8 37.5293 287.466 37.416 287.025 37.416C286.638 37.416 286.314 37.5137 286.052 37.709C285.79 37.9043 285.659 38.1406 285.659 38.418H284.57C284.57 38.1016 284.681 37.7969 284.904 37.5039C285.13 37.207 285.435 36.9727 285.818 36.8008C286.204 36.6289 286.628 36.543 287.089 36.543C287.82 36.543 288.392 36.7266 288.806 37.0938C289.22 37.457 289.435 37.959 289.45 38.5996V41.5176C289.45 42.0996 289.525 42.5625 289.673 42.9062V43H288.536ZM286.738 42.1738C287.077 42.1738 287.4 42.0859 287.704 41.9102C288.009 41.7344 288.23 41.5059 288.366 41.2246V39.9238H287.517C286.189 39.9238 285.525 40.3125 285.525 41.0898C285.525 41.4297 285.638 41.6953 285.865 41.8867C286.091 42.0781 286.382 42.1738 286.738 42.1738ZM293.13 41.4121L294.607 36.6602H295.767L293.218 43.9785C292.823 45.0332 292.197 45.5605 291.337 45.5605L291.132 45.543L290.728 45.4668V44.5879L291.021 44.6113C291.388 44.6113 291.673 44.5371 291.876 44.3887C292.083 44.2402 292.253 43.9688 292.386 43.5742L292.626 42.9297L290.365 36.6602H291.548L293.13 41.4121ZM297.759 36.6602L297.788 37.3633C298.253 36.8164 298.88 36.543 299.669 36.543C300.556 36.543 301.159 36.8828 301.48 37.5625C301.691 37.2578 301.964 37.0117 302.3 36.8242C302.64 36.6367 303.04 36.543 303.501 36.543C304.892 36.543 305.599 37.2793 305.622 38.752V43H304.538V38.8164C304.538 38.3633 304.435 38.0254 304.228 37.8027C304.021 37.5762 303.673 37.4629 303.185 37.4629C302.782 37.4629 302.448 37.584 302.183 37.8262C301.917 38.0645 301.763 38.3867 301.72 38.793V43H300.63V38.8457C300.63 37.9238 300.179 37.4629 299.277 37.4629C298.566 37.4629 298.079 37.7656 297.818 38.3711V43H296.734V36.6602H297.759ZM309.894 43.1172C309.034 43.1172 308.335 42.8359 307.796 42.2734C307.257 41.707 306.988 40.9512 306.988 40.0059V39.8066C306.988 39.1777 307.107 38.6172 307.345 38.125C307.587 37.6289 307.923 37.2422 308.353 36.9648C308.786 36.6836 309.255 36.543 309.759 36.543C310.583 36.543 311.224 36.8145 311.681 37.3574C312.138 37.9004 312.366 38.6777 312.366 39.6895V40.1406H308.072C308.087 40.7656 308.269 41.2715 308.616 41.6582C308.968 42.041 309.413 42.2324 309.952 42.2324C310.335 42.2324 310.659 42.1543 310.925 41.998C311.191 41.8418 311.423 41.6348 311.622 41.377L312.284 41.8926C311.753 42.709 310.956 43.1172 309.894 43.1172ZM309.759 37.4336C309.322 37.4336 308.954 37.5938 308.657 37.9141C308.361 38.2305 308.177 38.6758 308.107 39.25H311.282V39.168C311.251 38.6172 311.103 38.1914 310.837 37.8906C310.572 37.5859 310.212 37.4336 309.759 37.4336ZM314.652 36.6602L314.687 37.457C315.171 36.8477 315.804 36.543 316.585 36.543C317.925 36.543 318.601 37.2988 318.613 38.8105V43H317.529V38.8047C317.525 38.3477 317.419 38.0098 317.212 37.791C317.009 37.5723 316.691 37.4629 316.257 37.4629C315.906 37.4629 315.597 37.5566 315.331 37.7441C315.066 37.9316 314.859 38.1777 314.71 38.4824V43H313.626V36.6602H314.652ZM321.718 35.125V36.6602H322.902V37.498H321.718V41.4297C321.718 41.6836 321.771 41.875 321.876 42.0039C321.982 42.1289 322.161 42.1914 322.415 42.1914C322.54 42.1914 322.712 42.168 322.931 42.1211V43C322.646 43.0781 322.368 43.1172 322.099 43.1172C321.615 43.1172 321.249 42.9707 321.003 42.6777C320.757 42.3848 320.634 41.9688 320.634 41.4297V37.498H319.48V36.6602H320.634V35.125H321.718Z" fill="#212121"></path><path fillRule="evenodd" clipRule="evenodd" d="M78 17.5H162V18.5H78V17.5ZM198 17.5H282V18.5H198V17.5Z" fill="#2874F0"></path></svg></div>
