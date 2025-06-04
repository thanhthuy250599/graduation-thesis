import sys
from numpy.core.defchararray import count
from pandas.core.frame import DataFrame
from tensorflow import keras
assert sys.version_info >= (3, 5) # Python ≥3.5 is required
import tensorflow as tf
assert tf.__version__ >= "2.0" # TensorFlow ≥2.0 is required
import numpy as np
import joblib
from mosestokenizer import MosesTokenizer, MosesDetokenizer
import gdown
import zipfile
import pandas as pd
import string
import re 
import unicodedata  
from sklearn.model_selection import train_test_split


# Setup for GPU usage:
physical_devices = tf.config.list_physical_devices('GPU')
for gpu in physical_devices:
    tf.config.experimental.set_memory_growth(gpu, True)


# Declarations and functions for data preprocessing (used in Part 2 & Part 4)
eos_id = 0 # end-of-seq token id 
sos_id = 1 # start-of-seq token id
oov_id = 2 # out-of-vocab word id
def word_to_id(word, vocab_list):
    if word in vocab_list:
        return vocab_list.index(word) 
    else:
        return oov_id 
def id_to_word(id, vocab_list):
    return vocab_list[id]
def preprocess(X_comment, Y_label=None, for_training=False):
    '''
    Preprocess data.
    Input: X_comment: list of strings (comments)
           Y_label: list of labels (0,1,2). Required when for_training=True
           for_training: bool. If True: generate vocab and stuff
    Ouput: X_processed: tokenized and padded.
           Y_filter: list of labels filter according to X (only returned when for_training=True)
           vocab_X_size: size of vocab (only returned when for_training=True)
    '''

    # Delete all \n:
    # INFO: Mosses tokenizer (used below) reserves punctuation (what we want).
    #       but its can NOT deal with \n
    X_comment = [i.replace('\n',' ') for i in X_comment]

    # Convert to lowercase:
    X_comment = [i.lower() for i in X_comment]

    # Replace digits and punctuation by spaces (to remove them):
    marks_to_del = '012345678'+string.punctuation
    table = str.maketrans(marks_to_del, ' '*len(marks_to_del))
    X_comment = [i.translate(table) for i in X_comment]

    # Remove repeated characters, eg., đẹppppppp
    # tryex = re.sub(r'(.)\1+', r'\1', 'san  phẩmmmmm   loooiiiii :)))))))))') 
    X_comment = [re.sub(r'(.)\1+', r'\1', s) for s in X_comment] #Regex: https://docs.python.org/3/howto/regex.html#regex-howto 

    # Add accent (tool does not work so well, so DON'T use!)
    # from pyvi import ViUtils
    # ViUtils.add_accents('san phẩm chất luong') 

    # [IMPORTANT] Convert charsets (bảng mã) TCVN3, VIQG... to Unicode
    X_comment = [unicodedata.normalize('NFC', text) for text in X_comment]

    # [not really necessary] Connect words (in VNese, eg., "cực kỳ" is 1 word, "sản phẩm" is 1 word)
    #from pyvi import ViTokenizer
    #X_comment = [ViTokenizer.tokenize(i) for i in X_comment]

    # Tokenize text using Mosses tokenizer:
    # NOTE: Why choose Mosses tokenizer? See "How Much Does Tokenization Affect Neural Machine Translation?"    
    vi_tokenize = MosesTokenizer('vi')
    X_comment_tokenized = []
    X_comment_filtered = []
    Y_label_filtered = []
    for i in range(len(X_comment)): 
        comment = X_comment[i]
        tokens = vi_tokenize(comment) 
        #tokens = comment.split() # may try this instead of MosesTokenizer
        if tokens!=[]: # since some sentences become empty after tokenization
            #!! Truncate sentences !!
            # NOTE: Beware! can strongly affect the performance.
            X_comment_tokenized.append(tokens[:N_WORDS_KEPT])            
            X_comment_filtered.append(comment) 
            if for_training:
                Y_label_filtered.append(Y_label[i])
    vi_tokenize.close()


    if for_training:
        # Have a look at a comment and its tokens
        comment = 'Hàng xài ok nha mn,quên chụp rồi,giao_hàng nhanh_chóng đầy đủ ❤️❤️😂😂😂😂'
        print('\n',comment)
        with MosesTokenizer('vi') as vi_tokenize:
            tokens = vi_tokenize(comment)
        print('\n',tokens)
        with MosesDetokenizer('vi') as detokenize:
            comment_back = detokenize(tokens)
        print('\n',comment_back)

        # n_samples = len(X_comment_filtered)
        # joblib.dump(n_samples, r'./datasets/n_samples.joblib')
        joblib.dump(X_comment_tokenized, r'./datasets/X_comment_tokenized.joblib')
        joblib.dump(X_comment_filtered, r'./datasets/X_comment_filtered.joblib')
        joblib.dump(Y_label_filtered, r'./datasets/Y_label_filtered.joblib')
        print('\nDone making word lists.')

    if for_training:
        # Create vocabularies:
        words_list = [words for sentence in X_comment_tokenized for words in sentence]
        vocab, counts = np.unique(words_list, return_counts=True)
        vocab_count = {word:count for word, count in zip(vocab, counts)}
        print("full vocab.shape: ", vocab.shape)

        # Truncate the vocabulary (keep only words that appear at least min_occurrences times)
        truncated_vocab = dict(filter(lambda ele: ele[1]>=min_occurrences,vocab_count.items()))
        truncated_vocab = dict(sorted(truncated_vocab.items(), key=lambda item: item[1], reverse=True)) # Just to have low ids for most appeared words
        vocab_size = len(truncated_vocab)
        print("truncated vocal_size:", vocab_size)
        #joblib.dump(vocab_size,r'./datasets/vocab_size.joblib')

        # Creat vocal list to convert words to ids:
        # NOTE: preserve 0, 1, 3 for end-of-seq, start-of-seq, and oov-word token
        vocab_list = ['<eos>', '<sos>', '<oov>']
        vocab_list.extend(list(truncated_vocab.keys()))
        joblib.dump(vocab_list,r'SACR/vocab_list.joblib')  
        print('Done saving vocab_list.')   

        # Try encode, decoding some samples:
        temp_comment = X_comment_tokenized[:2]
        print('\ntemp_comment:',temp_comment)
        temp_encode = [list(map(lambda word: word_to_id(word, vocab_list), sentence)) for sentence in temp_comment]
        print('\ntemp_encode:',temp_encode)
    else:
        vocab_list = joblib.load(r'SACR/vocab_list.joblib')
        #vocab_size = joblib.load(r'./datasets/vocab_size.joblib')

    # Convert words (tokens) to ids: X_data: list of lists of token ids of X_comment_tokenized
    X_data = [list(map(lambda word: word_to_id(word, vocab_list), sentence)) for sentence in X_comment_tokenized]

    # Add end-of-seq and start-of-seq tokens:
    X_data =[[sos_id]+sentence+[eos_id] for sentence in X_data]
    
    # Pad zero to have all sentences of the same length (required when using batch_size>1):
    max_X_len = np.max([len(sentence) for sentence in X_data])
    X_padded = [sentence + [0]*(max_X_len - len(sentence)) for sentence in X_data]  
    
    # vocab_X_size = vocab_size + 3
    
    if for_training:
        print('\nDONE preprocessing data.')
        return np.array(X_padded), np.array(Y_label_filtered), vocab_list
    else: 
        return np.array(X_padded)

# Hyperparameters for preprocessing data:
N_WORDS_KEPT = 150 # NOTE: HYPERPARAM. Number of words to keep in each sample (a line in txt files)             
min_occurrences = 4 # NOTE: HYPERPARAM. Each word appear many times in the dataset. We only keep the words that occur > min_occurrences in the dataset. Amitabha 


def model_sentiment_analysis_customer_reviews(data: DataFrame):


    # In[4]: PART 4. PREDICT
    ##### NOTE: specify correct model file name below: ##### 
    model = keras.models.load_model(r'SACR/sentiment_GRU_epoch30_accuracy0.9568.h5') # BEST model here
    ##### IMPORTANT NOTE: MUST load the RIGHT vocab_list file that goes with the trained model used.
    vocab_list = joblib.load(r'SACR/vocab_list.joblib') 
    # label_meaning = {0: 'Không hài lòng', 1: 'Hài lòng', 2: 'Không rõ/Trung lập'}
    label_meaning = {0: -1, 1: 1, 2: 0}

    data = data

    comments = list(data["comment_product"])


    X_test_padded = preprocess(comments)
    y_proba = np.round(model.predict(X_test_padded),3)
    y_pred_label = np.argmax(y_proba, axis=1)

    result=[]
    for y, comment in zip(y_pred_label, comments):
        # print(label_meaning[y], ':', comment[:50])

      minilist = []
      minilist = [comment, int(label_meaning[y])]
      result.append(minilist)

    resultDF = pd.DataFrame(result, columns=["comment", "rating_model"])
    final = pd.concat([data['id_comment'], resultDF] , axis=1)
    data = data.merge(final,left_on=['id_comment'],right_on=['id_comment'],how='outer')

    # Compute avg. rating:
    y_values, counts = np.unique(y_pred_label, return_counts=True) 
    avg_rating = (counts[0]*1 + counts[1]*5 + counts[2]*2.5)/len(comments)
    # print('\nAvg. rating of these reviews (1-5 stars):', round(avg_rating,1))
    # # #update ratingavg of id_product in Database
    return data
