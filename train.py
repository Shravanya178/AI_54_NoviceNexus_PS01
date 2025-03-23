import os
import argparse
from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer,
    Trainer, 
    TrainingArguments,
    DataCollatorForLanguageModeling
)
from datasets import load_dataset

def train_model(args):
    # Load GPT-Neo model and tokenizer
    print(f"Loading model: {args.model_name}")
    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    model = AutoModelForCausalLM.from_pretrained(args.model_name)
    
    # Ensure tokenizer has PAD token
    if tokenizer.pad_token is None:
        tokenizer.add_special_tokens({"pad_token": "[PAD]"})
        model.resize_token_embeddings(len(tokenizer))
    
    # Load dataset
    print(f"Loading dataset from {args.data_path}")
    dataset = load_dataset('json', data_files=args.data_path)["train"]

    # Split dataset (90% train, 10% validation)
    dataset = dataset.train_test_split(test_size=0.1)
    
    # Tokenize dataset
    def tokenize_function(examples):
        return tokenizer(
            examples["chat"],  # Ensure the correct column is used
            padding="max_length",
            truncation=True,
            max_length=512
        )
    
    tokenized_datasets = dataset.map(
        tokenize_function, 
        batched=True,
        remove_columns=["chat", "Persona", "Unnamed: 0"]
    )
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False  # No masked language modeling for causal LM
    )
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir=f"{args.output_dir}/logs",
        logging_steps=100,
        save_strategy="epoch",
        evaluation_strategy="epoch",
        load_best_model_at_end=True,
        save_total_limit=3,
    )
    
    # Initialize Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        eval_dataset=tokenized_datasets["test"],
        data_collator=data_collator,
    )
    
    # Start training
    print("Starting training...")
    trainer.train()
    
    # Save the trained model
    print(f"Saving model to {args.output_dir}/final")
    model.save_pretrained(f"{args.output_dir}/final")
    tokenizer.save_pretrained(f"{args.output_dir}/final")
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train GPT-Neo Model")
    parser.add_argument("--model_name", type=str, default="EleutherAI/gpt-neo-125M", 
                        help="Base GPT-Neo model to fine-tune")
    parser.add_argument("--data_path", type=str, default="C:/Users/sanke/Downloads/AI model/data/processed_dataset.json", 
                        help="Path to training data")
    parser.add_argument("--output_dir", type=str, default="./model_output", 
                        help="Directory to save trained model")
    parser.add_argument("--epochs", type=int, default=1, 
                        help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=6, 
                        help="Batch size for training")
    
    args = parser.parse_args()
    train_model(args)
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=1,
    per_device_train_batch_size=6,
    save_steps=1000,
    save_total_limit=2,
    evaluation_strategy="epoch",
    logging_dir="./logs",
    logging_steps=100,
    fp16=True  # Enable FP16 training
)
