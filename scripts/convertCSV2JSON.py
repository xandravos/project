# Name: Xandra Vos
# Student number: 10731148
#
# Converts a csv file into a JSON file.

import csv
import pandas as pd
import json

INPUT_CSV = "nrg_ind_335a_1_Data.csv"

def load_csv(filename):
    """
    Loads csv file into python.
    """
    file = pd.read_csv(filename)
    file = file.drop(columns=["UNIT"])
    # print(file)

    return file

def file_to_data(filename):
    """
    Make a dictionary of the useful data.
    """
    data = [{"2007":{"Belgium":{"Total", }]


def make_json(filename):
    """
    Make a JSON file.
    """
    # with open("data.json", "w") as f:
    #     json.dump(data, f)

    # file = filename.set_index("TIME")
    file.to_json("data.json", orient="index")

if __name__ == "__main__":
    file = load_csv(INPUT_CSV)
    # data = file_to_data(file)
    make_json(file)
