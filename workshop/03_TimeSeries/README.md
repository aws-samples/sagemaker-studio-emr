# SageMaker + EMR: Timeseries

In this lab, we're going to utilize our knowledge of connecting and interacting with EMR clusters in order to perform
dataprep at scale for built-in SageMaker algorithms to train a probabilistic forecasting model.

The Amazon SageMaker DeepAR forecasting algorithm is a supervised learning algorithm for forecasting scalar
(one-dimensional) time series using recurrent neural networks (RNN). Classical forecasting methods, such as
autoregressive integrated moving average (ARIMA) or exponential smoothing (ETS), fit a single model to each
individual time series. They then use that model to extrapolate the time series into the future.

In many applications, however, you have many similar time series across a set of cross-sectional units. For example,
you might have time series groupings for demand for different products, server loads, and requests for webpages.
For this type of application, you can benefit from training a single model jointly over all of the time series. DeepAR
takes this approach. When your dataset contains hundreds of related time series, DeepAR outperforms the standard ARIMA
and ETS methods. You can also use the trained model to generate forecasts for new time series that are similar to the
ones it has been trained on.
