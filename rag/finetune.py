import torch
from datasets import load_dataset, Image as DatasetsImage
from transformers import (
    AutoProcessor,
    LlavaForConditionalGeneration,
    BitsAndBytesConfig,
    TrainingArguments,
)
from peft import LoraConfig
from trl import SFTTrainer
import os
import json
from PIL import Image

data_dir = "/content/drive/My Drive/RiceLeafDiseaseImages"
metadata_path = os.path.join(data_dir, "metadata_fixed.jsonl")

def create_metadata_file():
    print("metadata.jsonl not found. Creating it now...")
    os.makedirs(data_dir, exist_ok=True)
    metadata_content = []

    if not any(os.scandir(data_dir)):
        print(f"ERROR: The '{data_dir}' directory is empty.")
        print("Please add your image subfolders (e.g., 'Bacterial_Blight', 'Healthy') into this directory before running the script.")
        return

    for folder_name in os.listdir(data_dir):
        folder_path = os.path.join(data_dir, folder_name)
        if os.path.isdir(folder_path):
            for image_name in os.listdir(folder_path):
                if image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    file_path = os.path.join(folder_name, image_name).replace("\\", "/")
                    disease_name = folder_name.replace("_", " ")
                    text = f"An image of a rice leaf with {disease_name}."
                    data = {"file_name": file_path, "text": f"USER: <image>\nWhat disease is this? ASSISTANT: {text}"}
                    metadata_content.append(json.dumps(data, ensure_ascii=False))

    with open(metadata_path, "w", encoding="utf-8") as f:
        f.write("\n".join(metadata_content))

    print("metadata.jsonl created successfully.")


def main():
    if not os.path.exists(metadata_path):
        create_metadata_file()

    if not os.path.exists(metadata_path) or os.stat(metadata_path).st_size == 0:
        print(f"ERROR: The metadata file '{metadata_path}' is empty or was not created.")
        print("Please ensure your data directory contains image subfolders and try again.")
        return


    dataset = load_dataset("json", data_files=metadata_path, split="train")

    def transform_examples(examples):
        images = [Image.open(os.path.join(data_dir, fn)).convert("RGB") for fn in examples["file_name"]]
        examples["image"] = images
        return examples

    dataset.set_transform(transform_examples)

    model_name = "llava-hf/llava-1.5-7b-hf"
    processor = AutoProcessor.from_pretrained(model_name)
    processor.tokenizer.pad_token = processor.tokenizer.eos_token

    quant_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        llm_int8_enable_fp32_cpu_offload=True,
    )
    lora_config = LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05, bias="none", task_type="CAUSAL_LM")

    model = LlavaForConditionalGeneration.from_pretrained(
        model_name,
        quantization_config=quant_config,
    )

    training_args = TrainingArguments(
        output_dir="fine_tuned_model_final",
        num_train_epochs=1,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        optim="paged_adamw_32bit",
        learning_rate=1.4e-5,
        fp16=True,
        logging_steps=10,
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        peft_config=lora_config,
        dataset_text_field="text",
        tokenizer=processor.tokenizer,
        args=training_args,
        packing=False,
    )

    trainer.train()
    print("Fine-tuning complete!")

if __name__ == "__main__":
    main()