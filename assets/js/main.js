class RSA {
	static randomPrime(bits) {
		const min = bigInt.one.shiftLeft(bits - 1)
		const max = bigInt.one.shiftLeft(bits).prev()
		while (true) {
			let p = bigInt.randBetween(min, max)
			if (p.isProbablePrime(256)) {
				return p
			}
		}
	}

	static generate(keySize) {
		const e = this.randomPrime(keySize / 2)
		let p, q, phiN

		do {
			p = this.randomPrime(keySize / 2)
			q = this.randomPrime(keySize / 2)
			phiN = bigInt.lcm(p.prev(), q.prev())
		} while (
			bigInt.gcd(e, phiN).notEquals(1) ||
			p
				.minus(q)
				.abs()
				.shiftRight(keySize / 2 - 100)
				.isZero()
		)

		return {
			e,
			n: p.multiply(q),
			d: e.modInv(phiN)
		}
	}

	static encrypt(encodedMsg, e, n) {
		return bigInt(encodedMsg).modPow(e, n)
	}

	static decrypt(encryptedMsg, d, n) {
		return bigInt(encryptedMsg).modPow(d, n)
	}

	static encode(str) {
		const codes = str
			.split('')
			.map((c) => c.charCodeAt())
			.join('')

		return codes
	}

	static decode(code) {
		const stringified = code.toString()
		let str = ''

		for (let i = 0; i < stringified.length; i += 2) {
			let num = Number(stringified.substr(i, 2))

			if (num <= 30) {
				str += String.fromCharCode(Number(stringified.substr(i, 3)))
				i++
			} else {
				str += String.fromCharCode(num)
			}
		}

		return str
	}
}

// generate key event
const generateKeyPairButton = document.getElementById('generate-key-pair-btn')
const resultKeyWrapper = document.getElementById('generate-key-result-wrapper')
const publicKeyValue = document.getElementById('public-key-value')
const privateKeyValue = document.getElementById('private-key-value')

// encrypt text event
const textToEncryptData = document.getElementById('plaintext-encrypt-data')
const textToEncryptKey = document.getElementById('plaintext-encrypt-key')
const textToEncryptResult = document.getElementById('plaintext-encrypt-result')
const textToEncryptBtn = document.getElementById('plaintext-encrypt-button')
const textToEncryptResultWrapper = document.getElementById(
	'plaintext-encrypt-result-wrapper'
)

// decrypt text event
const encryptToTextData = document.getElementById('encrypt-plaintext-data')
const encryptToTextKey = document.getElementById('encrypt-plaintext-key')
const encryptToTextResult = document.getElementById('encrypt-plaintext-result')
const encryptToTextBtn = document.getElementById('encrypt-plaintext-button')
const encryptToTextResultWrapper = document.getElementById(
	'encrypt-plaintext-result-wrapper'
)

let publicKey, privateKey, N
const regex = /[0-9]+/

window.addEventListener('DOMContentLoaded', () => {
	generateKeyPairButton.addEventListener('click', () => {
		resultKeyWrapper.classList.remove('hidden')
		resultKeyWrapper.classList.add('grid')

		const keySize = Number(document.getElementById('rsa-key-size').value)

		if (keySize) {
			const { e, n, d } = RSA.generate(keySize)
			publicKey = e
			privateKey = d
			N = n

			setTimeout(() => {
				resultKeyWrapper.classList.remove('opacity-0')

				publicKeyValue.value = publicKey
				privateKeyValue.value = privateKey
			}, 500)
		} else {
			alert('Choose the key size!')
		}
	})

	textToEncryptBtn.addEventListener('click', () => {
		if (textToEncryptData.value && regex.test(textToEncryptKey.value)) {
			textToEncryptResultWrapper.classList.remove('hidden')
			textToEncryptResultWrapper.classList.add('flex')

			const message = textToEncryptData.value
			const key = bigInt(textToEncryptKey.value)

			setTimeout(() => {
				textToEncryptResultWrapper.classList.remove('opacity-0')

				const encryptedText = RSA.encrypt(RSA.encode(message), key, N)
				textToEncryptResult.value = encryptedText
			}, 500)
		} else {
			textToEncryptResultWrapper.classList.remove('opacity-0')

			setTimeout(() => {
				textToEncryptResultWrapper.classList.add('hidden')
				textToEncryptResultWrapper.classList.remove('flex')
			}, 500)

			alert(
				'Please fill the input box with a content that correspondent with the input lable'
			)
		}
	})

	encryptToTextBtn.addEventListener('click', () => {
		if (encryptToTextData.value && regex.test(encryptToTextKey.value)) {
			encryptToTextResultWrapper.classList.remove('hidden')
			encryptToTextResultWrapper.classList.add('flex')

			const encryptedMsg = bigInt(encryptToTextData.value)
			const key = bigInt(encryptToTextKey.value)

			setTimeout(() => {
				encryptToTextResultWrapper.classList.remove('opacity-0')

				const decryptedText = RSA.decode(RSA.decrypt(encryptedMsg, key, N))
				encryptToTextResult.value = decryptedText
			}, 500)
		} else {
			encryptToTextResultWrapper.classList.remove('opacity-0')

			setTimeout(() => {
				encryptToTextResultWrapper.classList.add('hidden')
				encryptToTextResultWrapper.classList.remove('flex')
			}, 500)

			alert(
				'Please fill the input box with a content that correspondent with the input lable'
			)
		}
	})
})
