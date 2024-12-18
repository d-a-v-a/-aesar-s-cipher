import {
  TuiButton,
  TuiError,
  TuiHintOptionsDirective,
  TuiNumberFormat,
  TuiRoot,
  TuiTextfieldOptionsDirective
} from "@taiga-ui/core";
import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiInputModule, TuiInputNumberModule, TuiTextareaModule } from '@taiga-ui/legacy';
import {
  TuiButtonLoading,
  TuiFieldErrorPipe,
  TuiSwitch,
  tuiSwitchOptionsProvider,
  tuiValidationErrorsProvider
} from '@taiga-ui/kit';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';

const ENCRYPT_TEXT_EXAMPLE = ``;

const DECRYPT_TEXT_EXAMPLE = `
РЬАЬА ШЮЙАП ОЩОСО ЫЕЦШТ ЩНРУЯ УЩЙГЦ ЯЩОРЫ ЙГТУА УЧЯЪЬ АЮНАТ УРЬЕШ ОЦЪОЩ
КЕЦШЫ ОТОЪШ ЬЮЬЩУ ЧЦЕУЮ АУЧЦХ РБЕЦА ЛАООТ ЯШОНЪ БХЙШО ХОРЙР ОУАБЫ ЙЩЙЧЯ
ЪЙЕЬШ ЯАЮОЖ ЫЙЧЕУ ЮАБГР ОАЦЩШ ОЮОЭБ ХЦШОЦ ЯАУШО УАШЩМ ШРУЫЫ ЙЧЯЬШ ЪОЩКЕ
ЦШЬЫЯ ЭОЯУА ЯНЬАЕ УЮЫЬС ЬСЫУР ОЪОЫЬ РУЫЦУ ЪПУЩЬ ЧЮБШЦ ЭЬЯЪЬ АЮЦЬС ЬЫКШЦ
ЭЮЦПЩ ЦФОМА ЯНЯЩУ РОРЦТ ЦЖКВО ШУЩЙР ЦТЦЖК ТЙЪШЦ ЛАЬРУ ЮЫЬЯО ЪОШЬЮ ЬЩУРО
ТУРЬЕ ШООГЫ УАХОЕ УЪАЙТ ЮОХЫЦ ЖКЪУЫ НЛАЬО ТЯШОН ЯРЦАО ШЬЮЬЩ УРОАО ГЬТЦА
ЯЮУТК ПУЩЬС ЬТЫНР ЯНСЦЮ ЩНЫТО ЪЦЮЬХ ЭУЮУР ЦАОЦЖ ЩУЧВУ УЫЬЯЦ АЪУЕО ЪЦХРУ
ЫНРХТ ЙГОМЗ ЦГЮЙД ОЮУЧЯ РЦАОР ТЮБСЭ ОНДЭУ ЮУСЫБ ЩЯНХО ЮОЪЭБ ЦШЮЦЕ ЦАЭЬЪ
ЬСЦАУ ЦЯАУШ ОМНШЩ МШРУЫ ЫЙЪЯЬ ШЬЪХО ПЦЫАЬ РОЫАЮ НЭЦДУ ЧЫОСЬ ЩЬРУЪ ЬУЧШО
ЮАЬЫЫ ЙЧЖЩУ ЪОРЮБ ШУТУЮ УРНЫЫ ЙЧЪУЕ ХОЭЩО ШОЩЦТ УРЬЕШ ОЦЪОЩ КЕЦШЦ ХОШЮЙ
ЩЯНРУ ЯУЩЙЧ ПОЩОС ОЫЕЦШ

`;

interface IFrequencies {
  [key: string]: number
}

const russianLetterFrequencies: IFrequencies = {
  "О": 0.090,
  "Е": 0.072,
  "А": 0.062,
  "И": 0.062,
  "Н": 0.053,
  "Т": 0.053,
  "С": 0.045,
  "Р": 0.040,
  "В": 0.038,
  "Л": 0.035,
  "К": 0.028,
  "М": 0.026,
  "Д": 0.025,
  "П": 0.023,
  "У": 0.021,
  "Я": 0.018,
  "Ы": 0.016,
  "Ь": 0.014,
  "Ъ": 0.014,
  "Г": 0.013,
  "З": 0.012,
  "Б": 0.014,
  "Ч": 0.012,
  "Й": 0.010,
  "Х": 0.009,
  "Ж": 0.007,
  "Ш": 0.006,
  "Ю": 0.006,
  "Ц": 0.003,
  "Щ": 0.003,
  "Э": 0.003,
  "Ф": 0.002,
} as const;

const englishLetterFrequencies: IFrequencies = {
  "A": 0.08167,
  "B": 0.01492,
  "C": 0.02782,
  "D": 0.04253,
  "E": 0.12702,
  "F": 0.02228,
  "G": 0.02015,
  "H": 0.06094,
  "I": 0.06966,
  "J": 0.00153,
  "K": 0.00772,
  "L": 0.04025,
  "M": 0.02406,
  "N": 0.06749,
  "O": 0.07507,
  "P": 0.01929,
  "Q": 0.00095,
  "R": 0.05987,
  "S": 0.06327,
  "T": 0.09056,
  "U": 0.02758,
  "V": 0.00978,
  "W": 0.02360,
  "X": 0.00150,
  "Y": 0.01974,
  "Z": 0.00074,
} as const;

export function maxLengthMessageFactory(context: { requiredLength: string }): string {
  return `Maximum length — ${context.requiredLength}`;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRoot,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiError,
    TuiHintOptionsDirective,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiInputModule,
    TuiTextfieldOptionsDirective,
    TuiInputNumberModule,
    TuiButton,
    TuiButtonLoading,
    TuiSwitch,
    FormsModule,
    TuiNumberFormat
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Это поля обязательно для заполнения',
      maxlength: maxLengthMessageFactory,
    }),
    tuiSwitchOptionsProvider({showIcons: false, appearance: () => 'primary'}),
  ],
})
export class AppComponent implements AfterViewInit {
  protected readonly maxLength: number = 10000;

  public loading: boolean = false;

  protected readonly cryptForm = new FormGroup({
    encrypt: new FormControl<string>('', [
      Validators.maxLength(this.maxLength),
    ]),
    encryptFinish: new FormControl<string>('', []),
    mEncrypt: new FormControl<number>(3, [
      Validators.required,
    ]),

    decrypt: new FormControl<string>('', [
      Validators.maxLength(this.maxLength),
    ]),
    decryptFinish: new FormControl<string>('', []),
    mDecrypt: new FormControl<number>(4, [
      Validators.required,
    ]),

    break: new FormControl<string>('', [
      Validators.maxLength(this.maxLength),
    ]),
    breakFinish: new FormControl<string>('', []),
    mBreak: new FormControl<number>(0, [
      Validators.required,
    ]),
    language: new FormControl(false, [
      Validators.required,
    ])
  });


  /** Зашифровка */
  public encrypt() {
    this.loading = true;
    let encryptControl: FormControl<string | null> = this.cryptForm.controls['encrypt'];
    let encryptFinishControl: FormControl<string | null> = this.cryptForm.controls['encryptFinish'];

    const shift: number = this.cryptForm.controls['mEncrypt'].value || 0;

    const alphabet: string[] = this.russianAlphabet;

    const text: string = this.filterText(encryptControl.value?.trim() || '');

    encryptControl.setValue(text.replace(/\s/g, '').replace(/(\D{5})/g, '$1 ').trim());

    const newText: string = this.getShiftOfAlphabetText(text, shift);

    encryptFinishControl.setValue(newText.replace(/\s/g, '').replace(/(\D{5})/g, '$1 ').trim());
    this.loading = false;
  }

  /** Расшифровка */
  public decrypt() {
    this.loading = true;
    let decryptControl: FormControl<string | null> = this.cryptForm.controls['decrypt'];
    let decryptFinishControl: FormControl<string | null> = this.cryptForm.controls['decryptFinish'];

    const shift: number = this.cryptForm.controls['mDecrypt'].value || 0;

    const text: string = this.filterText(decryptControl.value?.trim() || '');

    decryptControl.setValue(text.replace(/\s/g, '').replace(/(\D{5})/g, '$1 ').trim());

    const newText: string = this.getShiftOfAlphabetText(text, -shift);

    decryptFinishControl.setValue(newText.replace(/\s/g, '').replace(/(\D{5})/g, '$1 ').trim());
    this.loading = false;
  }

  public ngAfterViewInit(): void {
    tuiMarkControlAsTouchedAndValidate(this.cryptForm);
  }

  private readonly englishAlphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  private readonly russianAlphabet: string[] = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

  /** Взлом Методом наименьших квадратов */
  public breakCipher(): void {
    this.loading = true;

    const breakControl: FormControl<string | null> = this.cryptForm.controls['break'];
    const breakFinishControl: FormControl<string | null> = this.cryptForm.controls['breakFinish'];
    const alphabet: string[] = !!this.cryptForm.controls['language'].value ? this.englishAlphabet : this.russianAlphabet;
    const frequency: IFrequencies = !!this.cryptForm.controls['language'].value ? englishLetterFrequencies : russianLetterFrequencies;

    const text: string = this.filterText(breakControl.value || '', alphabet);

    breakControl.setValue(text.replace(/\s/g, '').replace(/(\D{5})/g, '$1 ').trim());

    const bestShift: number = this.decryptCaesarWithLeastSquares(
      text,
      alphabet,
      frequency,
    );

    const newText: string = this.getShiftOfAlphabetText(text, -bestShift);

    breakFinishControl.setValue(newText.replace(/\s/g, '').replace(/(\D{5})/g, '$1 ').trim());

    this.cryptForm.controls['mBreak'].setValue(bestShift);


    this.loading = false;
  }

  /** Расшифровка методом наименьших квадратов */
  private decryptCaesarWithLeastSquares(encryptedText: string, alphabet: string[], langFreq: IFrequencies) {
    let bestShift: number = 0;
    let minError: number = Infinity;

    for (let shift: number = 0; shift < alphabet.length; shift++) {

      const text: string = this.getShiftOfAlphabetText(encryptedText, -shift);
      const encryptedFreq: IFrequencies = this.getFrequency(text, alphabet);

      const arr: number[] = alphabet
        .map((char: string) => {
          return Math.pow(langFreq[char] - encryptedFreq[char], 2);
        });

      const error: number = arr.reduce((sum: number, x: number) => sum + x, 0);

      if (error < minError) {
        minError = error;
        bestShift = shift;
      }
    }

    return bestShift;
  }


  /** Частотный анализ текста */
  private getFrequency(text: string, alphabet: string[]): IFrequencies {
    const frequency: IFrequencies = {};
    const total: number = text.split("").filter((char) => alphabet.includes(char)).length;

    for (const char of alphabet) {
      frequency[char] = (text.split(char).length - 1) / total;
    }

    return frequency;
  }

  /** Возвращает текст сдвинутый по алфавиту на величину shift */
  private getShiftOfAlphabetText(text: string, shift: number): string {
    return text
      .split('')
      .map((char: string): string => {
        let alphabet: string[] = [];
        if (!this.russianAlphabet.includes(char) && !this.englishAlphabet.includes(char)) {
          return '';
        }
        if (this.russianAlphabet.includes(char)) {
          alphabet = this.russianAlphabet;
        }

        if (this.englishAlphabet.includes(char)) {
          alphabet = this.englishAlphabet;
        }

        let index: number = (alphabet.indexOf(char) + shift) % alphabet.length;

        if (index < 0) {
          index = alphabet.length + index;
        }

        return alphabet[index];
      }).join('');
  }

  /** Убирает лишние символы в зависимости от алфавита, заменяет некоторые символы на другие */
  private filterText(text: string, alphabet?: string[]): string {
    return text
      .split('')
      .map((x: string) => x.toUpperCase())
      .map((x: string) => {
        if (x === 'Ё') {
          return 'Е';
        }

        return x;
      })
      .filter((x: string) => this.russianAlphabet.includes(x) || this.englishAlphabet.includes(x))
      .filter((x: string) => (alphabet && alphabet.length && alphabet.length > 0) ? alphabet?.includes(x) : true)
      .join('');
  }
}
