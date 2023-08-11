Lors du get game:

- si la partie est commencée => vérifier que l'user exist sinon retourner une erreur et rediriger l'user
- si la partie n'est pas commencée => retourner la game (sans les userId) pour la sécu

Lors du join event:

- si la partie est commencée => reconnecter l'utilisateur
- si la partie n'est pas commencé => rejoindre la partie

Lors d'une coupure ws:

- si la partie est commencée => mettre un boolean pour dire que l'user est déconnecté
- si la partie n'est pas commencée => delete l'user

L'utilisateur courrant se fait souvent déconnecté et n'arrive pas a se reco après refresh

Côté api ne pas retourner le type de la card mais une card lambda pour n'avoir côté front que le dos de la card
Comme ça a été fait pour le role du joueur