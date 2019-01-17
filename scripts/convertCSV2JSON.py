# Name: Xandra Vos
# Student number: 10731148
#
# Converts a csv file into a JSON file.

import csv
import pandas as pd
import json

INPUT_CSV = "data.csv"

def load_csv(filename):
    """
    Loads csv file into python.
    """
    file = pd.read_csv(filename)

    return file


def file_to_data(file):
    """
    Make a dictionary of the useful data.
    """

    data = {}

    for index, row in file.iterrows():
        if row["TIME"] in data.keys():
            pass
        else:
            data[row["TIME"]] = {}

        if row["GEO"] in data[row["TIME"]].keys():
            pass
        else:
            data[row["TIME"]][row["GEO"]] = {}

        data[row["TIME"]][row["GEO"]][row["INDIC_EN"]] = float(row["Value"].replace(",", "."))

    return data


def make_json(filename):
    """
    Make a JSON file.
    """
    with open("data.json", "w") as f:
        json.dump(data, f)

if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    data = file_to_data(file)
    make_json(data)
