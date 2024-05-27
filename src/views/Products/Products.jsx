import { useState, useEffect } from "react";
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
  const [noMortgages, setNoMortgages] = useState({});

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

      // Filter products by category 'RESIDENTIAL_MORTGAGES'
      const filteredProducts = result.data.products.filter(
        (product) => product.productCategory === "RESIDENTIAL_MORTGAGES"
      );

      setData((prevData) => ({
        ...prevData,
        [brandName]: filteredProducts,
      }));

      setNoMortgages((prevNoMortgages) => ({
        ...prevNoMortgages,
        [brandName]: filteredProducts.length === 0,
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
      // Reset product details before fetching new details
      setProductDetails({});

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
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      marginBottom: "10px",
                    }}
                    onClick={() =>
                      handleBrandClick(brand.publicBaseUri, brand.brandName)
                    }
                  >
                    {brand.brandName}
                  </div>
                  {loading[brand.brandName] && <div>Loading...</div>}
                  {data[brand.brandName] &&
                    (data[brand.brandName].length > 0 ? (
                      <table
                        style={{
                          marginLeft: "20px",
                          borderCollapse: "collapse",
                          width: "100%",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                              }}
                            >
                              Product Name
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                              }}
                            >
                              Category
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "5px",
                              }}
                            >
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
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                }}
                              >
                                {product.name}
                              </td>
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                }}
                              >
                                {product.productCategory}
                              </td>
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                }}
                              >
                                {product.lastUpdated}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      noMortgages[brand.brandName] && (
                        <div style={{ marginLeft: "20px", color: "red" }}>
                          No residential mortgages available.
                        </div>
                      )
                    ))}
                  {data[brand.brandName] &&
                    data[brand.brandName].map((product) => (
                      <div
                        key={product.productId}
                        style={{ marginLeft: "20px", marginBottom: "20px" }}
                      >
                        {productDetails[product.productId] && (
                          <div
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              borderRadius: "5px",
                              backgroundColor: "#f9f9f9",
                            }}
                          >
                            <h3>Product Details:</h3>

                            <div>
                              <strong>Fees:</strong>
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                  marginBottom: "10px",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Fee Type
                                    </th>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Name
                                    </th>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productDetails[product.productId].fees &&
                                    productDetails[product.productId].fees.map(
                                      (fee, index) => (
                                        <tr key={index}>
                                          <td
                                            style={{
                                              border: "1px solid black",
                                              padding: "5px",
                                            }}
                                          >
                                            {fee.feeType}
                                          </td>
                                          <td
                                            style={{
                                              border: "1px solid black",
                                              padding: "5px",
                                            }}
                                          >
                                            {fee.name}
                                          </td>
                                          <td
                                            style={{
                                              border: "1px solid black",
                                              padding: "5px",
                                            }}
                                          >
                                            {fee.amount || fee.transactionRate}{" "}
                                            {fee.currency}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <strong>Features:</strong>
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                  marginBottom: "10px",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Feature Type
                                    </th>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Additional Info
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productDetails[product.productId].features &&
                                    productDetails[
                                      product.productId
                                    ].features.map((feature, index) => (
                                      <tr key={index}>
                                        <td
                                          style={{
                                            border: "1px solid black",
                                            padding: "5px",
                                          }}
                                        >
                                          {feature.featureType}
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid black",
                                            padding: "5px",
                                          }}
                                        >
                                          {feature.additionalValue ||
                                            feature.additionalInfo}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <strong>Lending Rates:</strong>
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                  marginBottom: "10px",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Rate Type
                                    </th>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Rate
                                    </th>
                                    <th
                                      style={{
                                        border: "1px solid black",
                                        padding: "5px",
                                      }}
                                    >
                                      Additional Info
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productDetails[product.productId]
                                    .lendingRates &&
                                    productDetails[
                                      product.productId
                                    ].lendingRates.map((rate, index) => (
                                      <tr key={index}>
                                        <td
                                          style={{
                                            border: "1px solid black",
                                            padding: "5px",
                                          }}
                                        >
                                          {rate.lendingRateType}
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid black",
                                            padding: "5px",
                                          }}
                                        >
                                          {rate.rate}
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid black",
                                            padding: "5px",
                                          }}
                                        >
                                          {rate.additionalInfo}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
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
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
    </Layout>
  );
};

export default Products;
