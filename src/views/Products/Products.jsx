import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { useAppDispatch } from "../../store/store";

const Products = () => {
  const { summary } = useSelector((state) => state.products);
  const dispatch = useAppDispatch();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [brandSummary, setBrandSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // useEffect(() => {
  //   const fetchBrandSummary = async () => {
  //     try {
  //       const headers = new Headers();
  //       headers.append("x-v", "1");
  //       headers.append("x-min-v", "4");

  //       const requestOptions = {
  //         method: "GET",
  //         headers: headers,
  //         redirect: "follow",
  //       };

  //       const response = await fetch(
  //         "https://api.cdr.gov.au/cdr-register/v1/banking/data-holders/brands/summary",
  //         requestOptions
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch brand summary");
  //       }

  //       const result = await response.json();
  //       console.log(result, "brand summary");

  //       setBrandSummary(result.data.brands);
  //       setSummaryLoading(false);
  //       setError(null);
  //     } catch (error) {
  //       setError(error.message);
  //       setSummaryLoading(false);
  //     }
  //   };

  //   fetchBrandSummary();
  // }, []);

  const fetchData = async (publicBaseUri, brandName) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [brandName]: true,
      }));
      const headers = new Headers();
      headers.append("x-v", "3");
      headers.append("x-min-v", "4");

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      const response = await fetch(
        `${publicBaseUri}/cds-au/v1/banking/products`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      console.log(result, "result");

      setData((prevData) => ({
        ...prevData,
        [brandName]: result.data.products,
      }));
      setLoading((prevLoading) => ({
        ...prevLoading,
        [brandName]: false,
      }));
      setError(null);
    } catch (error) {
      setError(error.message);
      setLoading((prevLoading) => ({
        ...prevLoading,
        [brandName]: false,
      }));
    }
  };

  const fetchProductDetails = async (publicBaseUri, productId) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: true,
      }));
      const headers = new Headers();
      headers.append("x-v", "4");
      headers.append("x-min-v", "1");

      const requestOptions = {
        method: "GET",
        headers: headers,
        redirect: "follow",
      };

      const response = await fetch(
        `${publicBaseUri}/cds-au/v1/banking/products/${productId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const result = await response.json();
      console.log(result, "product details");

      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: result.data,
      }));
      setLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: false,
      }));
      setError(null);
    } catch (error) {
      setError(error.message);
      setLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: false,
      }));
    }
  };

  const handleBrandClick = (publicBaseUri, brandName) => {
    fetchData(publicBaseUri, brandName);
  };

  const handleProductClick = (publicBaseUri, productId) => {
    fetchProductDetails(publicBaseUri, productId);
  };

  return (
    <Layout>
      <div>
        {summaryLoading ? (
          <div>Loading brand summary...</div>
        ) : (
          <div>
            {summary &&
              summary.map((brand) => (
                <div key={brand.brandId} style={{ padding: "10px" }}>
                  <div
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() =>
                      handleBrandClick(brand.publicBaseUri, brand.brandName)
                    }
                  >
                    {brand.brandName}
                  </div>
                  {loading[brand.brandName] && <div>Loading...</div>}
                  {data[brand.brandName] &&
                    data[brand.brandName].length > 0 && (
                      <table
                        style={{
                          marginLeft: "20px",
                          borderCollapse: "collapse",
                          width: "100%",
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ border: "1px solid black" }}>
                              Product Name
                            </th>
                            <th style={{ border: "1px solid black" }}>
                              Category
                            </th>
                            <th style={{ border: "1px solid black" }}>
                              Last Updated
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data[brand.brandName].map((product) => (
                            <tr
                              key={product.productId}
                              onClick={() =>
                                handleProductClick(
                                  brand.publicBaseUri,
                                  product.productId
                                )
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <td style={{ border: "1px solid black" }}>
                                {product.name}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {product.productCategory}
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                {product.lastUpdated}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  {data[brand.brandName] &&
                    data[brand.brandName].map((product) => (
                      <div key={product.productId}>
                        {productDetails[product.productId] && (
                          <div
                            style={{ marginLeft: "40px", paddingTop: "10px" }}
                          >
                            <h3>Product Details:</h3>
                            <div>
                              <strong>Eligibility:</strong>
                              <ul>
                                {productDetails[product.productId]
                                  .eligibility &&
                                  productDetails[
                                    product.productId
                                  ].eligibility.map((elig, index) => (
                                    <li key={index}>
                                      {elig.eligibilityType}:{" "}
                                      {elig.additionalInfo}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                            <div>
                              <strong>Fees:</strong>
                              <ul>
                                {productDetails[product.productId].fees &&
                                  productDetails[product.productId].fees.map(
                                    (fee, index) => (
                                      <li key={index}>
                                        {fee.name} ({fee.feeType}):{" "}
                                        {fee.amount || fee.transactionRate}{" "}
                                        {fee.currency} - {fee.additionalInfo}
                                      </li>
                                    )
                                  )}
                              </ul>
                            </div>
                          </div>
                        )}
                        {loading[product.productId] && (
                          <div style={{ marginLeft: "40px" }}>
                            Loading details...
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}
      </div>
      {error && <div>Error: {error}</div>}
    </Layout>
  );
};

export default Products;
