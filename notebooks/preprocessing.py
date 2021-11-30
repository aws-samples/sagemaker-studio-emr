import argparse
import os
import warnings

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelBinarizer, KBinsDiscretizer
from sklearn.preprocessing import PolynomialFeatures
from sklearn.compose import make_column_transformer

from sklearn.exceptions import DataConversionWarning
warnings.filterwarnings(action='ignore', category=DataConversionWarning)
import re
import csv 

labels_dict = {'positive':'__label__positive',
               'negative':'__label__negative'
              }

def remove_between_square_brackets(text):
    return re.sub('\[[^]]*\]', '', text)

def denoise_text(text):
    text = remove_between_square_brackets(text)
    return text

def preprocess_text(document):
    document = denoise_text(document)
    # Remove all the special characters
    document = re.sub(r'\W', ' ', str(document))

    # remove all single characters
    document = re.sub(r'\s+[a-zA-Z]\s+', ' ', document)

    # Remove single characters from the start
    document = re.sub(r'\^[a-zA-Z]\s+', ' ', document)

    # Substituting multiple spaces with single space
    document = re.sub(r'\s+', ' ', document, flags=re.I)

    # Removing prefixed 'b'
    document = re.sub(r'^b\s+', '', document)

    return document

def process_data(df):
    df['sentiment'] = df['sentiment'].apply(labels_dict.get)
    df['review'] = df['review'].apply(preprocess_text)

    df['document'] = df[df.columns[::-1]].apply(
        lambda x: ' '.join(x.dropna().astype(str)),
        axis=1
    )

    df.drop(['sentiment', 'review'], axis=1, inplace=True)
    
    return df

if __name__=='__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--train-test-split-ratio', type=float, default=0.3)
    args, _ = parser.parse_known_args()
    
    print('Received arguments {}'.format(args))

    input_data_path = os.path.join('/opt/ml/processing/input', 'movie_reviews.csv')
    
    print('Reading input data from {}'.format(input_data_path))
    df = pd.read_csv(input_data_path)
    train_data, validation_data = df[:25000], df[25000:]
    print(train_data.head())
    train_data_df = train_data.copy()
    validation_data_df = validation_data.copy()
    
    train_data_df = process_data(train_data_df)
    validation_data_df = process_data(validation_data_df)
    
    print("train_data=============================")
    print(train_data_df.head())
    
    print("validation_data========================")
    print(validation_data_df.head())
    
    train_features_output_path = os.path.join('/opt/ml/processing/train', 'train.csv')
    
    test_features_output_path = os.path.join('/opt/ml/processing/validation', 'validation.csv')
    
    train_data_df.to_csv(path_or_buf=train_features_output_path, sep=" ",
                  header=False,
                  index=False, line_terminator='\n',quoting = csv.QUOTE_NONE, escapechar = ' ')

    validation_data_df.to_csv(path_or_buf=test_features_output_path, sep=" ",
                       header=False,
                       index=False, line_terminator='\n', quoting = csv.QUOTE_NONE, escapechar = ' ')
    

    
